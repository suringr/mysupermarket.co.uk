import * as fs from "fs";
import * as path from "path";
import { ALL_ROUTES } from "../src/shared/routes";

const TEMPLATE_PATH = path.join(__dirname, "templates", "page.template.html");
const PUBLIC_DIR = path.join(process.cwd(), "public");

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

    ALL_ROUTES.forEach(route => {
        generatePage(route);
    });

    console.log(`\n✅ Generated ${ALL_ROUTES.length} route pages (${ALL_ROUTES.length - 4} hub pages + ${ALL_ROUTES.length - (ALL_ROUTES.length - 4)} detail pages)`);
}

main();
