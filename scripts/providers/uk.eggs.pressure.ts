
import { fetchHtml } from "../lib/fetch-layer";
import { ProviderOutput, Confidence, ProviderMetadata } from "../lib/types";
import { buildFallback, readLastGood } from "../lib/file-system";

const META: ProviderMetadata = {
    id: "uk.eggs.pressure",
    title: "UK Eggs Pressure",
    type: "price_signal",
    source: {
        name: "Office for National Statistics",
        url: "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/j9dm/mm23/data"
    }
};

interface ONSPoint {
    date: string; // "2023 OCT"
    value: string; // "350" (pence usually)
}

interface ONSResponse {
    months: ONSPoint[];
}

export async function run(): Promise<ProviderOutput> {
    try {

        const lastGood = readLastGood(META.id);
        const response = await fetchHtml(META.source.url, { providerId: META.id });

        if (!response.ok) {
            return buildFallback(META, `Fetch failed (${response.status})`, lastGood);
        }

        const data = JSON.parse(response.text) as ONSResponse;
        const months = data.months;

        if (!months || months.length < 13) {
            // Need at least 13 months for YoY
            return buildFallback(META, "Insufficient historical data (need 13+ months)", lastGood);
        }

        const current = months[months.length - 1];
        const lastYear = months[months.length - 13];

        const priceCurrent = parseFloat(current.value);
        const priceLastYear = parseFloat(lastYear.value);

        const yoyChange = ((priceCurrent - priceLastYear) / priceLastYear) * 100;

        // Status derivation
        let status = "stable";
        if (yoyChange > 2.0) status = "rising";
        if (yoyChange < -2.0) status = "easing";

        // Parse date
        const date = new Date(`${current.date} 1`);

        // Freshness Check (User Request: >45 days => Medium/Low)
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let confidence = Confidence.High;
        if (diffDays > 45) {
            confidence = Confidence.Medium;
        }

        const output: ProviderOutput = {
            ...META,
            region: "uk",
            status: status,
            confidence: confidence,
            last_checked_utc: new Date().toISOString(),
            last_official_update: date.toISOString(),
            signal: {
                yoy_percent: parseFloat(yoyChange.toFixed(1)),
                current_price_index: priceCurrent, // or raw price
                period: current.date,
                is_stale: diffDays > 45
            }
        };

        return output;

    } catch (error: any) {
        const lastGood = readLastGood(META.id);
        return buildFallback(META, `Unexpected error: ${error.message}`, lastGood);
    }
}
