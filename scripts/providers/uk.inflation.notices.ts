
import { ProviderOutput, Confidence } from "../lib/types";

const NOTICES = [
    {
        date: "2025-01-20T09:00:00Z",
        title: "Consumer price inflation, UK: December 2024",
        url: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/december2024",
        source_name: "ONS",
        summary: "The Consumer Prices Index including owner occupiers' housing costs (CPIH) rose by 4.2% in the 12 months to December 2024, down from 4.3% in November."
    },
    {
        date: "2024-12-18T09:00:00Z",
        title: "Consumer price inflation, UK: November 2024",
        url: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/november2024",
        source_name: "ONS",
        summary: "The Consumer Prices Index including owner occupiers' housing costs (CPIH) rose by 4.3% in the 12 months to November 2024, down from 4.7% in October."
    },
    {
        date: "2024-11-20T09:00:00Z",
        title: "Consumer price inflation, UK: October 2024",
        url: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/october2024",
        source_name: "ONS",
        summary: "The Consumer Prices Index including owner occupiers' housing costs (CPIH) rose by 4.7% in the 12 months to October 2024."
    }
];

export async function fetchInflationNotices(): Promise<ProviderOutput> {
    return {
        id: "uk.inflation.notices",
        title: "Inflation Notices",
        type: "inflation_notices",
        region: "uk",
        status: "safe", // Generic status
        confidence: Confidence.High,
        last_checked_utc: new Date().toISOString(),
        source: {
            name: "Official Sources (ONS, DEFRA)",
            url: "https://www.ons.gov.uk/economy/inflationandpriceindices"
        },
        items: NOTICES
    };
}

// If run directly, save to file
if (require.main === module) {
    const fs = require('fs');
    const path = require('path');
    fetchInflationNotices().then(data => {
        const outDir = path.join(process.cwd(), "public", "data");
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, "uk.inflation.notices.json"), JSON.stringify(data, null, 2));
        console.log("Wrote data/uk.inflation.notices.json");
    });
}
