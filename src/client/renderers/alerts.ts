import { fetchData } from "../data";
import { renderLayout } from "../layout";

export async function renderAlerts(path: string): Promise<string> {
    const data = await fetchData("uk.food-alerts");
    const items = data?.items || [];

    // Determine category from path: /alerts or /alerts/allergy etc.
    const parts = path.split('/').filter(Boolean);
    const category = parts[1] || "all"; // alerts/xy

    const filtered = category === "all" ? items : items.filter((i: any) => i.problem?.type === category);

    // Hub View (Categories)
    const hubNav = `
        <div class="hub-nav">
            <a href="/alerts" class="${category === 'all' ? 'active' : ''}">All</a> |
            <a href="/alerts/allergy" class="${category === 'allergy' ? 'active' : ''}">Allergy</a> |
            <a href="/alerts/recall" class="${category === 'recall' ? 'active' : ''}">Recalls</a>
        </div>
    `;

    const listHtml = filtered.length > 0 ? filtered.map((item: any) => `
        <div class="card">
             <div class="meta">${new Date(item.created).toLocaleDateString()}</div>
             <h3>${item.title}</h3>
             <p>${item.shortTitle || item.title}</p>
             <div class="confidence-pill">${item.problem?.type || 'Alert'}</div>
        </div>
    `).join("") : `<p>No alerts found for this category.</p>`;

    const content = `
        ${hubNav}
        <h2>${category.charAt(0).toUpperCase() + category.slice(1)} Alerts</h2>
        <div class="signal-grid">
            ${listHtml}
        </div>
    `;

    return renderLayout("Alerts & Recalls", content);
}
