
import { run as runFoodAlerts } from "./providers/uk.food-alerts";
import { run as runInflation } from "./providers/uk.food-inflation";
import { run as runEggs } from "./providers/uk.eggs.pressure";
import { writeProviderResult } from "./lib/file-system";
import { ProviderOutput } from "./lib/types";

const PROVIDERS = [
    { name: "Food Alerts", run: runFoodAlerts },
    { name: "Food Inflation", run: runInflation },
    { name: "Eggs Pressure", run: runEggs }
];

async function main() {
    console.log("Starting data refresh...");
    const start = Date.now();

    // Run sequentially or parallel? Parallel is fine for these.
    // Sequential for better logging clarity? Parallel is faster.

    const results = await Promise.all(PROVIDERS.map(async (p) => {
        console.log(`Running ${p.name}...`);
        try {
            const result = await p.run();
            // Validate result shape slightly? (optional)
            return result;
        } catch (e: any) {
            console.error(`CRITICAL: Provider ${p.name} threw uncaught error: ${e.message}`);
            // This shouldn't happen as providers have internal try/catch/fallback
            // But if it does, return a dummy failure object to prevent crash
            const dummy: ProviderOutput = {
                id: "unknown",
                title: p.name,
                type: "error",
                region: "uk",
                status: "error",
                confidence: "low" as any,
                last_checked_utc: new Date().toISOString(),
                source: { name: "System", url: "" },
                reason: `Uncaught system error: ${e.message}`
            };
            return dummy;
        }
    }));

    console.log("Writing results...");
    results.forEach(r => {
        if (r.id !== "unknown") {
            writeProviderResult(r);
        } else {
            console.error("Skipping write for unknown/crashed provider result");
        }
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`Done in ${elapsed}s.`);
}

main().catch(err => {
    console.error("Fatal script error:", err);
    process.exit(1);
});
