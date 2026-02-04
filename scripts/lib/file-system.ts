
import * as fs from "fs";
import * as path from "path";
import { ProviderOutput, Confidence, ProviderMetadata } from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "data");
const LAST_GOOD_DIR = path.join(DATA_DIR, "_last_good");

export function ensureDataDirs() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(LAST_GOOD_DIR)) fs.mkdirSync(LAST_GOOD_DIR, { recursive: true });
}

export function getOutputPath(id: string): string {
    return path.join(DATA_DIR, `${id}.json`);
}

export function getLastGoodPath(id: string): string {
    return path.join(LAST_GOOD_DIR, `${id}.json`);
}

export function readLastGood(id: string): ProviderOutput | null {
    const filepath = getLastGoodPath(id);
    if (!fs.existsSync(filepath)) {
        // Also check the main data dir in case _last_good isn't populated yet but successful data exists?
        // But strict "last good" usually implies a validated backup.
        // For MVP, if we fail, and we have a previous run output in data/, we could technically use it, 
        // but let's stick to strict _last_good folder which we populate on success.
        return null;
    }
    try {
        const content = fs.readFileSync(filepath, "utf-8");
        return JSON.parse(content) as ProviderOutput;
    } catch {
        return null;
    }
}

export function writeProviderResult(data: ProviderOutput) {
    ensureDataDirs();

    // 1. Write to main data output
    const outputPath = getOutputPath(data.id);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");

    // 2. If successful/fresh, backup to _last_good
    if (data.status !== "unknown" && data.confidence !== Confidence.Low && !data.reason) {
        const lastGoodPath = getLastGoodPath(data.id);
        fs.writeFileSync(lastGoodPath, JSON.stringify(data, null, 2), "utf-8");
        console.log(`[File] Saved ${data.id} (High Confidence) to _last_good`);
    }

    console.log(`[File] Wrote ${data.id}.json (Status: ${data.status}, Confidence: ${data.confidence})`);
}

export function buildFallback(
    meta: ProviderMetadata,
    reason: string,
    lastGood: ProviderOutput | null
): ProviderOutput {
    const now = new Date().toISOString();

    if (lastGood) {
        return {
            ...lastGood,
            status: lastGood.status, // Keep status but downgrade confidence? Or mark as "stale"?
            // User requested honesty: "status: unknown with low confidence" if info isn't available.
            // But validation plan says: "If using data/_last_good/, publish fallback JSON with confidence: low and a reason."
            // So we reuse the data but mark low confidence.
            confidence: Confidence.Low,
            last_checked_utc: now,
            reason: `Using cached data: ${reason}`,
            // Preserve other fields
        };
    }

    return {
        ...meta,
        region: "uk",
        status: "unknown",
        confidence: Confidence.Low,
        last_checked_utc: now,
        reason: reason,
        source: meta.source
    };
}
