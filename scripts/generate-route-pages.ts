/**
 * Generate static route HTML pages from template
 * Adapted from NextReset's update-game-pages.ts
 */

import * as fs from "fs";
import * as path from "path";
import { ROUTES } from "../src/shared/routes";

const TEMPLATE_PATH = path.join(__dirname, "templates", "page.template.html");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function generatePage(route: { path: string; title: string }) {
    // Read template
    let html = fs.readFileSync(TEMPLATE_PATH, "utf-8");

    // Replace placeholders
    html = html.replace(/__TITLE__/g, route.title);
    html = html.replace(/__PATH__/g, route.path);

    // Determine output path
    let outputPath: string;
    if (route.path === "/") {
        outputPath = path.join(PUBLIC_DIR, "index.html");
    } else {
        // e.g., /price-pressure/ -> public/price-pressure/index.html
        const dirPath = path.join(PUBLIC_DIR, route.path);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        outputPath = path.join(dirPath, "index.html");
    }

    // Write file
    fs.writeFileSync(outputPath, html, "utf-8");
    console.log(`✓ Generated ${outputPath.replace(PUBLIC_DIR, "public")}`);
}

function main() {
    console.log("Generating static route pages...\n");

    ROUTES.forEach(route => {
        generatePage(route);
    });

    console.log(`\n✅ Generated ${ROUTES.length} route pages`);
}

main();
