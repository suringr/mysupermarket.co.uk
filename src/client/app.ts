import { fetchMeta } from "./data";
import { updateMetaDate } from "./layout";
import { renderHome } from "./renderers/home";
import { renderPricePressure } from "./renderers/price-pressure";
import { renderInflation } from "./renderers/inflation";
import { renderAlerts } from "./renderers/alerts";

// Placeholder for 404
async function renderNotFound(): Promise<string> {
    const { renderLayout } = await import("./layout");
    return renderLayout("404 Not Found", `<h2>Not Found</h2><p>Page not found.</p>`);
}

async function route() {
    const path = window.location.pathname;
    const app = document.getElementById("app");
    if (!app) return;

    // Show loading?
    // app.innerHTML = '<div style="padding:20px;">Loading...</div>';

    let html = "";

    try {
        if (path === "/" || path === "/index.html") {
            html = await renderHome();
        } else if (path.startsWith("/price-pressure")) {
            html = await renderPricePressure(path);
        } else if (path.startsWith("/inflation-trends")) {
            html = await renderInflation();
        } else if (path.startsWith("/alerts")) {
            html = await renderAlerts(path);
        } else {
            html = await renderNotFound();
        }

        app.innerHTML = html;

    } catch (e) {
        console.error("Render error:", e);
        app.innerHTML = `<div style="color:red; padding:20px;">Error loading page. Please refresh.</div>`;
    }
}

// Init
window.addEventListener("popstate", route);
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Fetch Meta & Registry first to set cache version
    try {
        const meta = await fetchMeta();
        if (meta && meta.lastUpdated) {
            updateMetaDate(meta.lastUpdated);
        }
    } catch (e) {
        console.error("Init error:", e);
    }

    // 2. Intercept clicks for SPA
    document.body.addEventListener("click", e => {
        const target = (e.target as HTMLElement).closest("a");
        if (target && target.getAttribute("href")?.startsWith("/") && !target.getAttribute("target")) {
            e.preventDefault();
            history.pushState(null, "", target.getAttribute("href"));
            route();
        }
    });

    // 3. Initial Route
    route();
});
