
import * as fs from "fs";
import * as path from "path";
import {
    layout, homepage,
    pricePressureHub, productDetail,
    inflationTrendsHub, alertsHub, alertsList
} from "./templates/html";
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

    // 1. Homepage
    // Homepage is now static (gateway cards only), depends on no dynamic data
    const homeHtml = layout("Dashboard", homepage(), false); // false = no home link on home
    fs.writeFileSync(path.join(OUT_DIR, "index.html"), homeHtml);
    console.log("Wrote public/index.html");

    // 2. Price Pressure Hub & Details
    const productSignals = data.filter(d => d.type === "price_signal");
    if (productSignals.length > 0) {
        ensureDir(path.join(OUT_DIR, "price-pressure"));
        const hubHtml = layout("Price Pressure", pricePressureHub(productSignals));
        fs.writeFileSync(path.join(OUT_DIR, "price-pressure", "index.html"), hubHtml);
        console.log("Wrote public/price-pressure/index.html");

        productSignals.forEach(p => {
            const slug = p.title.toLowerCase().replace(/\s+/g, '-');
            const pDir = path.join(OUT_DIR, "price-pressure", slug);
            ensureDir(pDir);
            const detailHtml = layout(p.title, productDetail(p));
            fs.writeFileSync(path.join(pDir, "index.html"), detailHtml);
            console.log(`Wrote public/price-pressure/${slug}/index.html`);
        });
    }

    // 3. Inflation Trends
    const inflationData = data.find(d => d.id === "uk.food-inflation");
    if (inflationData) {
        ensureDir(path.join(OUT_DIR, "inflation-trends"));
        const trendsHub = layout("Inflation Trends", inflationTrendsHub(inflationData));
        fs.writeFileSync(path.join(OUT_DIR, "inflation-trends", "index.html"), trendsHub);
        console.log("Wrote public/inflation-trends/index.html");
    }

    // 4. Alerts
    const alertsData = data.find(d => d.id === "uk.food-alerts");
    if (alertsData) {
        // Hub
        ensureDir(path.join(OUT_DIR, "alerts"));
        const hubHtml = layout("Alerts & Recalls", alertsHub(alertsData));
        fs.writeFileSync(path.join(OUT_DIR, "alerts", "index.html"), hubHtml);
        console.log("Wrote public/alerts/index.html");

        // Lists: All, Allergy, Recalls
        const categories = ["all", "allergy", "recalls"];
        categories.forEach(cat => {
            const catDir = path.join(OUT_DIR, "alerts", cat);
            ensureDir(catDir);
            // Capitalize first letter
            const title = cat.charAt(0).toUpperCase() + cat.slice(1);
            const listHtml = layout(`${title} Alerts`, alertsList(alertsData, cat));
            fs.writeFileSync(path.join(catDir, "index.html"), listHtml);
            console.log(`Wrote public/alerts/${cat}/index.html`);
        });
    }

    console.log("Pages updated.");
}

main().catch(console.error);
