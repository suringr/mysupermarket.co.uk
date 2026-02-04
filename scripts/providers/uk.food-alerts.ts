
import { XMLParser } from "fast-xml-parser";
import { fetchHtml } from "../lib/fetch-layer";
import { ProviderOutput, Confidence, ProviderMetadata } from "../lib/types";
import { buildFallback, readLastGood } from "../lib/file-system";

const META: ProviderMetadata = {
    id: "uk.food-alerts",
    title: "UK Food Alerts",
    type: "alerts",
    source: {
        name: "Food Standards Agency",
        url: "https://data.food.gov.uk/food-alerts/id/rss/recent"
    }
};

interface RSSItem {
    title: string;
    link: string; // or guid
    pubDate: string;
    description: string;
    guid: string;
}

export async function run(): Promise<ProviderOutput> {
    try {
        const lastGood = readLastGood(META.id);
        const response = await fetchHtml(META.source.url, {
            providerId: META.id,
            headers: {
                "Accept": "application/rss+xml, application/xml, text/xml" // Explicitly ask for XML
            }
        });

        if (!response.ok) {
            return buildFallback(META, `Fetch failed (${response.status})`, lastGood);
        }

        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        });
        const feed = parser.parse(response.text);

        // Handle different RSS structures (standard RSS 2.0 or Atom if FSA changes)
        // Usually FSA is RSS 2.0: rss -> channel -> item[]
        const items: RSSItem[] = feed?.rss?.channel?.item || feed?.feed?.entry || [];

        if (!Array.isArray(items) || items.length === 0) {
            return buildFallback(META, "No items found in RSS feed", lastGood);
        }

        // Transform items
        const transformedItems = items.slice(0, 20).map((item) => {
            // Normalize pubDate
            const dateStr = item.pubDate || "";
            let isoDate = "";
            try {
                isoDate = new Date(dateStr).toISOString();
            } catch {
                isoDate = new Date().toISOString(); // Fallback if invalid
            }

            return {
                title: item.title,
                url: item.link || item.guid, // FSA uses link usually
                date_utc: isoDate,
                summary: item.description // Optional, might strip HTML later if needed
            };
        });

        const output: ProviderOutput = {
            ...META,
            region: "uk",
            status: "active", // Always active if we have feed
            confidence: Confidence.High,
            last_checked_utc: new Date().toISOString(),
            items: transformedItems
        };

        return output;

    } catch (error: any) {
        const lastGood = readLastGood(META.id);
        return buildFallback(META, `Unexpected error: ${error.message}`, lastGood);
    }
}
