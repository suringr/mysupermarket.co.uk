
import { fetchHtml } from "../lib/fetch-layer";
import { ProviderOutput, Confidence, ProviderMetadata } from "../lib/types";
import { buildFallback, readLastGood } from "../lib/file-system";

const META: ProviderMetadata = {
    id: "uk.food-inflation",
    title: "UK Food Inflation (CPI)",
    type: "trend",
    source: {
        name: "Office for National Statistics",
        url: "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7c8/mm23/data"
    }
};

interface ONSPoint {
    date: string; // "2023 OCT"
    value: string; // "10.1"
    year: string;
    month: string;
}

interface ONSResponse {
    description: unknown;
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

        if (!data.months || data.months.length === 0) {
            return buildFallback(META, "No monthly data found in ONS response", lastGood);
        }

        const latest = data.months[data.months.length - 1];

        // Parse date "2023 DEC" -> ISO
        const dateStr = `${latest.date} 1`; // "2023 DEC 1"
        const date = new Date(dateStr);
        // Correct to end of month availability roughly? Or just use the 1st of that month as reference.
        // ONS releases data mid-month for previous month. So "2023 DEC" is released in JAN.
        // We will store the date of the signal itself (Dec 2023).

        if (isNaN(date.getTime())) {
            return buildFallback(META, `Failed to parse date: ${latest.date}`, lastGood);
        }

        const inflationValue = parseFloat(latest.value);

        // Check freshness
        // If data is older than ~45 days, confidence drops.
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isStale = diffDays > 60; // Allow 60 days (since data is 1 month lag + release time)

        const output: ProviderOutput = {
            ...META,
            region: "uk",
            status: isStale ? "outdated" : "officially_reported",
            confidence: isStale ? Confidence.Medium : Confidence.High,
            last_checked_utc: new Date().toISOString(),
            last_official_update: date.toISOString(),
            signal: {
                food_inflation_yoy_percent: inflationValue,
                period: latest.date
            }
        };

        return output;

    } catch (error: any) {
        const lastGood = readLastGood(META.id);
        return buildFallback(META, `Unexpected error: ${error.message}`, lastGood);
    }
}
