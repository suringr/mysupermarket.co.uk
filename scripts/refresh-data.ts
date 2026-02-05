import * as fs from "fs";
import * as path from "path";
import { run as runFoodAlerts } from "./providers/uk.food-alerts";
import { run as runInflation } from "./providers/uk.food-inflation";
import { run as runEggs } from "./providers/uk.eggs.pressure";
import { writeLiveJson, writeLkgJson, readLkgData } from "./lib/data-output";
import { ProviderOutput, FailureType } from "./lib/types";

const PROVIDERS = [
    { name: "Food Alerts", id: "uk.food-alerts", run: runFoodAlerts },
    { name: "Food Inflation", id: "uk.food-inflation", run: runInflation },
    { name: "Eggs Pressure", id: "uk.eggs.pressure", run: runEggs }
];

// Check for STRICT_REFRESH mode
const STRICT_REFRESH = process.env.STRICT_REFRESH === "true";

async function main() {
    console.log("Starting data refresh...");
    console.log(`Mode: ${STRICT_REFRESH ? "STRICT (fail on any unavailable)" : "FAIL-SAFE (fail if ≥50% unavailable)"}`);
    const start = Date.now();

    const results: ProviderOutput[] = [];
    let freshCount = 0;
    let staleCount = 0;
    let unavailableCount = 0;

    // Run providers sequentially for better logging clarity
    for (const provider of PROVIDERS) {
        console.log(`\nRunning ${provider.name}...`);
        try {
            // Try to run provider
            const result = await provider.run();

            // Provider returned successfully - it's fresh
            writeLiveJson(result);
            writeLkgJson(result);  // Dual-write to vault

            results.push(result);
            freshCount++;

        } catch (error: any) {
            console.warn(`  ⚠ Provider ${provider.name} failed: ${error.message}`);

            // Attempt LKG recovery
            const lkgData = readLkgData(provider.id);

            if (lkgData) {
                // LKG exists - create stale result
                console.log(`  → Using LKG fallback (status: stale)`);
                const staleResult: ProviderOutput = {
                    ...lkgData,
                    status: "stale",
                    fetched_at_utc: new Date().toISOString(),
                    reason: `Provider failed: ${error.message}`,
                    failure_type: FailureType.Unavailable
                };

                writeLiveJson(staleResult);  // Write to live only (never overwrite LKG with stale)
                results.push(staleResult);
                staleCount++;

            } else {
                // No LKG - create unavailable result
                console.error(`  ✗ No LKG available (status: unavailable)`);
                const unavailableResult: ProviderOutput = {
                    provider_id: provider.id,
                    title: provider.name,
                    type: "price-pressure",  // Default, providers should define this
                    source_url: "",
                    status: "unavailable",
                    fetched_at_utc: new Date().toISOString(),
                    region: "uk",
                    reason: `Provider failed and no LKG data available: ${error.message}`,
                    failure_type: FailureType.Unavailable
                };

                writeLiveJson(unavailableResult);
                results.push(unavailableResult);
                unavailableCount++;
            }
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("Summary:");
    console.log(`  Fresh:       ${freshCount}`);
    console.log(`  Stale:       ${staleCount}`);
    console.log(`  Unavailable: ${unavailableCount}`);
    console.log("=".repeat(60));

    // Auto-generate registry
    console.log("\nGenerating _registry.json...");
    const registryItems = results.map(r => ({
        id: r.provider_id,
        title: r.title,
        type: r.type,
        status: r.status,
        updated: r.fetched_at_utc
    }));

    const registryPath = path.join(process.cwd(), "public", "data", "_registry.json");
    fs.writeFileSync(registryPath, JSON.stringify(registryItems, null, 2));
    console.log("✓ Wrote _registry.json");

    // Write _meta.json
    const meta = {
        lastUpdated: new Date().toISOString(),
        version: "1.0.0",
        status: unavailableCount === 0 ? "success" : (unavailableCount >= PROVIDERS.length / 2 ? "degraded" : "partial")
    };
    const metaPath = path.join(process.cwd(), "public", "data", "_meta.json");
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    console.log("✓ Wrote _meta.json");

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\nDone in ${elapsed}s.`);

    // Exit code logic
    if (STRICT_REFRESH && unavailableCount > 0) {
        console.error("\n❌ STRICT_REFRESH mode: Exiting with code 1 (unavailable providers detected)");
        process.exit(1);
    } else if (unavailableCount >= PROVIDERS.length / 2) {
        console.error(`\n❌ Fail-safe threshold exceeded: ${unavailableCount}/${PROVIDERS.length} unavailable (≥50%)`);
        process.exit(1);
    } else {
        console.log("\n✅ Refresh completed successfully");
        process.exit(0);
    }
}

main().catch(err => {
    console.error("Fatal script error:", err);
    process.exit(1);
});
