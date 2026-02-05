/**
 * Safe data output helper - handles LKG vault and dual-write pattern
 * Adapted from NextReset for MySupermarket
 */

import * as fs from "fs";
import * as path from "path";
import { ProviderOutput } from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "data");
const LKG_DIR = path.join(DATA_DIR, "_lkg");

/**
 * Get output path for live provider data
 */
export function getLivePath(id: string): string {
    return path.join(DATA_DIR, `${id}.json`);
}

/**
 * Get output path for LKG provider data
 */
export function getLkgPath(id: string): string {
    return path.join(LKG_DIR, `${id}.json`);
}

/**
 * Ensure data directories exist
 */
export function ensureDataDirs(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LKG_DIR)) {
        fs.mkdirSync(LKG_DIR, { recursive: true });
    }
}

/**
 * Read last known good data from the LKG vault
 * Returns null if missing or corrupt
 */
export function readLkgData(id: string): ProviderOutput | null {
    const filepath = getLkgPath(id);

    if (!fs.existsSync(filepath)) {
        return null;
    }

    try {
        const content = fs.readFileSync(filepath, "utf-8");
        return JSON.parse(content) as ProviderOutput;
    } catch (error) {
        console.warn(`[LKG] Corrupt LKG file found for ${id}:`, error);
        return null;
    }
}

/**
 * Write to LIVE data folder (Always called)
 */
export function writeLiveJson(data: ProviderOutput): void {
    ensureDataDirs();
    const filepath = getLivePath(data.provider_id);
    const cleaned = JSON.parse(JSON.stringify(data));
    fs.writeFileSync(filepath, JSON.stringify(cleaned, null, 2), "utf-8");

    // Log write
    const indicator = data.status === "fresh" ? "✓" : (data.status === "stale" ? "⚠" : "✗");
    console.log(`${indicator} Wrote live/${data.provider_id}.json (${data.status})`);
}

/**
 * Write to LKG vault (Only called on FRESH success)
 */
export function writeLkgJson(data: ProviderOutput): void {
    if (data.status !== "fresh") {
        console.warn(`[LKG] Attempted to write non-fresh data to LKG vault for ${data.provider_id}`);
        return;
    }

    ensureDataDirs();
    const filepath = getLkgPath(data.provider_id);
    const cleaned = JSON.parse(JSON.stringify(data));
    fs.writeFileSync(filepath, JSON.stringify(cleaned, null, 2), "utf-8");
    console.log(`  + Backed up to _lkg/${data.provider_id}.json`);
}
