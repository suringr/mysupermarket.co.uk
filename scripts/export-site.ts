
import * as fs from "fs";
import * as path from "path";

/**
 * Export site: Copy public/ → dist/
 */

function rmrf(p: string) {
    if (!fs.existsSync(p)) return;
    try {
        fs.rmSync(p, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    } catch (err: any) {
        // If directory is locked (e.g., by a dev server), warn but continue
        if (err.code === 'ENOTEMPTY' || err.code === 'EBUSY') {
            console.warn(`⚠️  Warning: Could not fully clean ${p} (may be in use). Copying anyway...`);
        } else {
            throw err;
        }
    }
}

const MAX_RETRIES = 5;
const RETRY_DELAY = 500;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function copyFileWithRetry(src: string, dest: string, retries = 0) {
    try {
        fs.copyFileSync(src, dest);
    } catch (err: any) {
        if (retries < MAX_RETRIES && (err.code === 'EBUSY' || err.code === 'EPERM')) {
            const delay = RETRY_DELAY * (retries + 1);
            console.warn(`⚠️  Locked: ${path.basename(src)}. Retrying in ${delay}ms...`);
            // Synchronous sleep for a sync script is fine, or we use a busy loop
            const start = Date.now();
            while (Date.now() - start < delay) { }
            copyFileWithRetry(src, dest, retries + 1);
        } else {
            console.error(`❌ Failed to copy ${src} -> ${dest}: ${err.message}`);
            throw err;
        }
    }
}

function copyDir(src: string, dest: string) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(s, d);
        } else {
            copyFileWithRetry(s, d);
        }
    }
}

const root = process.cwd();
const src = path.join(root, "public");
const out = path.join(root, "dist");

if (!fs.existsSync(src)) {
    console.error("❌ Missing public/ directory. Cannot export site.");
    process.exit(1);
}

console.log("🗑️  Cleaning old dist/...");
rmrf(out);

console.log("📦 Copying public/ → dist/...");
copyDir(src, out);

console.log("✅ Exported site: public/ → dist/");
