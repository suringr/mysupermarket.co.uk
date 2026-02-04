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

    // Normalize path to remove trailing slash
    const normalizedPath = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

    let html = "";

    try {
        if (normalizedPath === "/" || normalizedPath === "/index.html") {
            html = await renderHome();
        } else if (normalizedPath.startsWith("/price-pressure")) {
            html = await renderPricePressure(normalizedPath);
        } else if (normalizedPath.startsWith("/inflation-trends")) {
            html = await renderInflation();
        } else if (normalizedPath.startsWith("/alerts")) {
            html = await renderAlerts(normalizedPath);
        } else {
            console.warn(`No route match for: ${normalizedPath}`);
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
