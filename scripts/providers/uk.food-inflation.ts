
import { fetchHtml } from "../lib/fetch-layer";
import { ProviderOutput, Confidence, ProviderMetadata } from "../lib/types";

const META: ProviderMetadata = {
    provider_id: "uk.food-inflation",
    title: "UK Food Inflation (CPI)",
    type: "inflation-trends",
    source_url: "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7c8/mm23/data"
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
    const response = await fetchHtml(META.source_url, { providerId: META.provider_id });

    if (!response.ok) {
        throw new Error(`Fetch failed (${response.status})`);
    }

    const data = JSON.parse(response.text) as ONSResponse;

    if (!data.months || data.months.length === 0) {
        throw new Error("No monthly data found in ONS response");
    }

    const latest = data.months[data.months.length - 1];

    // Parse date "2023 DEC" -> ISO
    const dateStr = `${latest.date} 1`; // "2023 DEC 1"
    const date = new Date(dateStr);
    // ONS releases data mid-month for previous month. So "2023 DEC" is released in JAN.
    // We will store the date of the signal itself (Dec 2023).

    if (isNaN(date.getTime())) {
        throw new Error(`Failed to parse date: ${latest.date}`);
    }

    const inflationValue = parseFloat(latest.value);

    // Check freshness
    // If data is older than ~60 days, confidence drops.
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isStale = diffDays > 60; // Allow 60 days (since data is 1 month lag + release time)

    const output: ProviderOutput = {
        ...META,
        region: "uk",
        status: "fresh",  // Providers only return fresh
        confidence: isStale ? Confidence.Medium : Confidence.High,
        fetched_at_utc: new Date().toISOString(),
        last_official_update: date.toISOString(),
        signal: {
            food_inflation_yoy_percent: inflationValue,
            period: latest.date,
            is_stale: isStale
        }
    };

    return output;
}
