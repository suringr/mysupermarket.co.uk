
import { fetchHtml } from "../lib/fetch-layer";
import { ProviderOutput, Confidence, ProviderMetadata, PricePressureSignal } from "../lib/types";

const META: ProviderMetadata = {
    provider_id: "uk.eggs.pressure",
    title: "Eggs",
    type: "price-pressure",
    source_url: "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/j9dm/mm23/data"
};

interface ONSPoint {
    date: string; // "2023 OCT"
    value: string; // "350" (pence usually)
}

interface ONSResponse {
    months: ONSPoint[];
}

export async function run(): Promise<ProviderOutput> {
    const response = await fetchHtml(META.source_url, { providerId: META.provider_id });

    if (!response.ok) {
        throw new Error(`Fetch failed (${response.status})`);
    }

    const data = JSON.parse(response.text) as ONSResponse;
    const months = data.months;

    if (!months || months.length < 13) {
        // Need at least 13 months for YoY
        throw new Error("Insufficient historical data (need 13+ months)");
    }

    const current = months[months.length - 1];
    const lastYear = months[months.length - 13];

    const priceCurrent = parseFloat(current.value);
    const priceLastYear = parseFloat(lastYear.value);

    const yoyChange = ((priceCurrent - priceLastYear) / priceLastYear) * 100;

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
        status: "fresh",  // Providers only return fresh
        confidence: confidence,
        fetched_at_utc: new Date().toISOString(),
        last_official_update: date.toISOString(),
        signal: {
            yoy_percent: parseFloat(yoyChange.toFixed(1)),
            current_price_index: priceCurrent,
            period: current.date,
            is_stale: diffDays > 45
        }
    };

    return output;
}
