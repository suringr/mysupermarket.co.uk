import { fetchData } from "../data";
import { renderLayout } from "../layout";

export async function renderAlerts(slug?: string): Promise<string> {
    // Fetch canonical alerts.json
    const data = await fetchData("alerts");
    const items = data?.items || [];
    const lastUpdate = data?.last_official_update ? new Date(data.last_official_update).toLocaleDateString() : "Unknown";

    // Strict Bulletin List View
    const listHtml = items.length > 0 ? items.map((item: any) => {
        const dateStr = item.modified || item.created;
        const displayDate = dateStr ? new Date(dateStr).toLocaleDateString() : "Unknown";
        const link = item.alert_url && item.alert_url.startsWith("http")
            ? `<a href="${item.alert_url}" target="_blank" rel="noopener noreferrer">View on FSA &rarr;</a>`
            : "";

        return `
        <div class="card" style="border-left: 4px solid #dda720;">
             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="meta">${displayDate}</span>
                <span class="confidence-pill" style="background:#eee; color:#333;">${item.type}</span>
             </div>
             <h3 style="margin: 0 0 10px 0;">${item.title}</h3>
             ${link ? `<div style="margin-top:10px; font-size:0.9em;">${link}</div>` : ""}
        </div>
        `;
    }).join("") : `<p>No active notices found.</p>`;

    const content = `
        <div style="margin-bottom:30px;">
            <h2>Safety Alerts</h2>
            <p class="meta">Official recalls & allergy warnings from the UK Food Standards Agency (FSA).</p>
            <p class="meta">Last Official Update: ${lastUpdate}</p>
        </div>
        <div class="signal-grid" style="grid-template-columns: 1fr;"> 
            ${listHtml}
        </div>
    `;

    return renderLayout("Safety Alerts", content);
}
