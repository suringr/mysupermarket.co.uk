import { fetchMeta, fetchRegistry } from "./data";
import { updateMetaDate } from "./layout";
import { renderHome } from "./renderers/home";
import { renderPricePressure } from "./renderers/price-pressure";
import { renderInflation } from "./renderers/inflation";
import { renderAlerts } from "./renderers/alerts";

// 404 Renderer
async function renderNotFound(): Promise<string> {
    const { renderLayout } = await import("./layout");
    return renderLayout("404 Not Found", `
        <div class="container" style="text-align: center; padding: 50px 0;">
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/" class="back-link">Return Home</a>
        </div>
    `);
}

async function route() {
    const path = window.location.pathname;
    const app = document.getElementById("app");
    if (!app) return;

    // Normalize: ensure trailing slash
    const normalizedPath = path.endsWith("/") ? path : path + "/";

    // Split into segments
    const segments = normalizedPath.split("/").filter(s => s.length > 0);

    let html = "";

    try {
        // Home
        if (segments.length === 0) {
            html = await renderHome();
        }
        // Hub pages
        else if (segments.length === 1) {
            const hub = segments[0];
            if (hub === "price-pressure") {
                html = await renderPricePressure();  // No slug = hub view
            } else if (hub === "inflation-trends") {
            } else if (hub === "inflation-trends") {
                html = await renderInflation();
            } else if (hub === "alerts") {
                html = await renderAlerts();
            } else {
                html = await renderNotFound();
            }
        }
        // Detail pages: /price-pressure/eggs/
        else if (segments.length === 2) {
            const [hub, slug] = segments;

            // Validate entity exists before rendering
            const { ENTITIES_BY_HUB } = await import("../shared/entities");
            const hubEntities = ENTITIES_BY_HUB[hub] || [];
            const entityExists = hubEntities.some(e => e.id === slug);

            if (!entityExists) {
                html = await renderNotFound();  // Immediate 404 for invalid entities
            } else if (hub === "price-pressure") {
            } else if (hub === "price-pressure") {
                html = await renderPricePressure(slug);  // Pass slug to renderer
            } else if (hub === "alerts") {
                html = await renderAlerts(slug);
            } else {
                // Hub exists but doesn't support detail pages yet
                html = await renderNotFound();
            }
        }
        // Pagination: /alerts/page/2/
        else if (segments.length === 3) {
            const [excludeAlerts, excludePage, pageNum] = segments;
            if (excludeAlerts === "alerts" && excludePage === "page") {
                html = await renderAlerts(pageNum);
            } else {
                html = await renderNotFound();
            }
        }
        else {
            html = await renderNotFound();
        }

        app.innerHTML = html;
        window.scrollTo(0, 0);

    } catch (e) {
        console.error("Render error:", e);
        app.innerHTML = `<div class="container error"><h2>Error loading page</h2><p>Please refresh.</p></div>`;
    }
}

// Init
window.addEventListener("popstate", route);
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Fetch Meta & Registry first
    try {
        const [meta, registry] = await Promise.all([
            fetchMeta(),
            fetchRegistry() // Ensure this function exists in data.ts
        ]);

        if (meta && meta.lastUpdated) {
            updateMetaDate(meta.lastUpdated);
        }

        // Registry can be stored globally or in a specialized store if needed
        // For now, we just ensure it's fetched to prime any caches
        if (registry) {
            console.log("Registry loaded", registry.length, "items");
        }

    } catch (e) {
        console.error("Init error (non-fatal):", e);
    }

    // 2. Intercept clicks for SPA
    document.body.addEventListener("click", e => {
        const target = (e.target as HTMLElement).closest("a");
        if (target && target.getAttribute("href")?.startsWith("/") && !target.getAttribute("target")) {
            e.preventDefault();
            const href = target.getAttribute("href")!;
            history.pushState(null, "", href);
            route();
        }
    });

    // 3. Initial Route
    route();
});
