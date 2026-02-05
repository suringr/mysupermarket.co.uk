import * as fs from "fs";
import * as path from "path";
import { ALL_ROUTES } from "../src/shared/routes";

const TEMPLATE_PATH = path.join(__dirname, "templates", "page.template.html");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const DATA_DIR = path.join(PUBLIC_DIR, "data");

function generatePage(route: { path: string; title: string }) {
    // Read template
    let html = fs.readFileSync(TEMPLATE_PATH, "utf-8");

    // Replace placeholders
    html = html.replace(/__TITLE__/g, route.title);
    html = html.replace(/__PATH__/g, route.path);

    // Determine output path
    // FIX: Strip leading slash to avoid absolute path issues
    const routeDir = route.path === "/" ? "" : route.path.replace(/^\//, "");
    const dirPath = path.join(PUBLIC_DIR, routeDir);

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const outputPath = path.join(dirPath, "index.html");

    // Write file
    fs.writeFileSync(outputPath, html, "utf-8");
    console.log(`✓ Generated ${outputPath.replace(PUBLIC_DIR, "public")}`);
}

function main() {
    console.log("Generating static route pages...\n");

    // 1. Generate Standard Routes (Hubs + Details)
    // /alerts/ (Page 1) is included here via HUB_ROUTES
    ALL_ROUTES.forEach(route => {
        generatePage(route);
    });

    // 2. Generate Paginated Alert Pages
    const alertsPath = path.join(DATA_DIR, "alerts.json");
    if (fs.existsSync(alertsPath)) {
        try {
            const content = fs.readFileSync(alertsPath, "utf-8");
            const data = JSON.parse(content);
            const items = data.items || [];
            const PAGE_SIZE = 10;
            const totalPages = Math.ceil(items.length / PAGE_SIZE) || 1;

            console.log(`\nGenerating pagination for ${items.length} alerts (${totalPages} pages)...`);

            // Start from Page 2 (Page 1 is /alerts/)
            for (let i = 2; i <= totalPages; i++) {
                const route = {
                    path: `/alerts/page/${i}/`,
                    title: `Safety Alerts (Page ${i}) - MySupermarket`
                };
                generatePage(route);
            }

        } catch (e) {
            console.warn("⚠️ Failed to generate alerts pagination:", e);
        }
    } else {
        console.warn("⚠️ No alerts.json found, skipping pagination generation.");
    }

    console.log(`\n✅ Generated static pages.`);
}

main();
