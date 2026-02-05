
import { fetchHtml } from "../lib/fetch-layer";
import { ProviderOutput, Confidence, ProviderMetadata, FailureType, ProviderType } from "../lib/types";

// Canonical metadata
// NOTE: provider_id is "alerts" to match requested output filename "alerts.json"
const META: ProviderMetadata = {
    provider_id: "alerts",
    title: "Safety Alerts",
    type: "alerts-recalls" as ProviderType,
    source_url: "https://data.food.gov.uk/food-alerts/id.json?_limit=50&_sort=-modified"
};

interface FSAPayload {
    items: FSAItem[];
    meta: any;
}

interface FSAItem {
    notation: string; // id
    title: string;
    shortTitle?: string;
    type: string[]; // e.g. [.../def/AA]
    status?: { label: string };
    created: string;
    modified: string;
    alertURL: string;
    reportingBusiness?: { commonName: string };
    problem?: Array<{
        riskStatement?: string;
        allergen?: Array<{ label: string }>;
        type?: string;
    }>;
    productDetails?: Array<{ productName: string }>;
}

export async function run(): Promise<ProviderOutput> {
    const headers = {
        "Accept": "application/json",
        "User-Agent": "mysupermarket.co.uk (signals bot)"
    };

    // Use fetchHtml which handles retries and fetching. 
    // We parse the text response as JSON.
    const response = await fetchHtml(META.source_url, {
        providerId: META.provider_id,
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`Fetch failed (${response.status})`);
    }

    let payload: FSAPayload;
    try {
        payload = JSON.parse(response.text);
    } catch (e) {
        throw new Error("Failed to parse JSON response");
    }

    const rawItems = payload.items || [];

    // Strict Mapping
    const items = rawItems.map(item => {
        // Derive type tag
        let type = "Alert";
        const types = item.type || [];
        if (types.some(t => t.endsWith("/def/AA"))) type = "AA";
        else if (types.some(t => t.endsWith("/def/PRIN"))) type = "PRIN";
        else if (types.some(t => t.endsWith("/def/FAFA"))) type = "FAFA";

        // Flatten allergens
        const allergens = new Set<string>();
        item.problem?.forEach(p => {
            p.allergen?.forEach(a => {
                if (a.label) allergens.add(a.label);
            });
        });

        // Flatten products
        const products = (item.productDetails?.map(p => p.productName) || []).filter(Boolean);

        return {
            id: item.notation,
            type: type,
            status: item.status?.label || "Unknown",
            title: item.shortTitle || item.title,
            created: item.created,
            modified: item.modified,
            alert_url: item.alertURL,
            business: item.reportingBusiness?.commonName,
            products: products,
            allergens: Array.from(allergens),
            risk_statement: item.problem?.[0]?.riskStatement
        };
    });

    // Last Official Update logic: max modified or created date
    let lastUpdate = "";
    if (items.length > 0) {
        // Sort descent to find max
        const dates = items.map(i => i.modified || i.created).filter(Boolean);
        dates.sort().reverse();
        if (dates.length > 0) lastUpdate = dates[0];
    }

    const output: ProviderOutput = {
        ...META,
        region: "uk",
        status: "fresh",
        confidence: Confidence.High,
        fetched_at_utc: new Date().toISOString(),
        last_official_update: lastUpdate || new Date().toISOString(),
        items: items,
        count: items.length
    };

    return output;
}
