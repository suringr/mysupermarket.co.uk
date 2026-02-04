
import * as fs from "fs";
import * as path from "path";
import { layout, homepage, statusPage } from "./templates/html";
import { ProviderOutput } from "./lib/types";

const DATA_DIR = path.join(process.cwd(), "public", "data");
const OUT_DIR = path.join(process.cwd(), "public");

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readData(): ProviderOutput[] {
    // Filter .json files
    if (!fs.existsSync(DATA_DIR)) return [];
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json") && !f.startsWith("_"));
    return files.map(f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf-8")));
}

async function main() {
    console.log("Updating pages in public/...");
    ensureDir(OUT_DIR);

    // NOTE: CSS and assets are assumed to be in public/ already

    const data = readData();

    // Update Homepage
    const homeHtml = layout("Dashboard", homepage(data));
    fs.writeFileSync(path.join(OUT_DIR, "index.html"), homeHtml);
    console.log("Wrote public/index.html");

    // Update Status Pages
    data.forEach(item => {
        let subDir = "";
        if (item.id === "uk.food-alerts") subDir = "status/food-alerts";
        if (item.id === "uk.food-inflation") subDir = "trends/food-inflation";
        if (item.id === "uk.eggs.pressure") subDir = "prices/eggs";

        if (subDir) {
            const targetDir = path.join(OUT_DIR, subDir);
            ensureDir(targetDir);
            const pageHtml = layout(item.title, statusPage(item));
            fs.writeFileSync(path.join(targetDir, "index.html"), pageHtml);
            console.log(`Wrote public/${subDir}/index.html`);
        }
    });

    console.log("Pages updated.");
}

main().catch(console.error);
