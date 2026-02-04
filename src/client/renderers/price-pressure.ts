import { fetchData } from "../data";
import { renderLayout } from "../layout";
import { ProviderOutput } from "../../scripts/lib/types";

export async function renderPricePressure(path: string): Promise<string> {
    const parts = path.split('/').filter(Boolean);
    const slug = parts[1]; // price-pressure/:slug

    if (!slug) {
        // Hub view - List all signals
        // Ideally we fetch a list of all signals. 
        // For now, we only have one known: Eggs.
        // We really need a "uk.price-pressure.index.json" or similar.
        // Or we can just list the ones we know.

        const eggs = await fetchData("uk.eggs.pressure");
        const signals = [eggs].filter(Boolean) as ProviderOutput[];

        const listHtml = signals.map(s => `
            <a href="/price-pressure/${s.title.toLowerCase().replace(/\s+/g, '-')}" class="card" style="text-decoration:none; color:inherit; display:block;">
                <h3>${s.title}</h3>
                <div class="signal-value ${s.status === 'rising' ? 'trend-up' : 'trend-flat'}">${s.status.toUpperCase()}</div>
                <div class="meta">Updated: ${new Date(s.last_checked_utc).toLocaleDateString()}</div>
            </a>
        `).join("");

        return renderLayout("Price Pressure Hub", `
            <div class="signal-grid">
                ${listHtml}
            </div>
        `);
    } else {
        // Detail view
        // Map slug back to ID? 
        // "eggs" -> "uk.eggs.pressure".
        // This is fragile. Ideally the hub has links with IDs or we scan files.
        // For MVP, hardcode mapping.
        let id = "";
        if (slug.includes("egg")) id = "uk.eggs.pressure";

        if (!id) return renderLayout("Not Found", "<p>Signal not found.</p>");

        const data = await fetchData(id);
        if (!data) return renderLayout("Not Found", "<p>Data unavailable.</p>");

        const signal = data.signal as any;
        const trend = data.status === 'rising' ? 'High / Rising' : 'Stable';

        const content = `
            <div class="card">
                <h2>${data.title}</h2>
                <div class="signal-value ${data.status === 'rising' ? 'trend-up' : 'trend-flat'}">${trend}</div>
                <p><strong>YoY Increase:</strong> ${signal?.yoy_percent || '--'}%</p>
                <p><strong>Current Price:</strong> £${signal?.price || '--'} (${signal?.unit || ''})</p>
                <div class="meta">Source: ${data.source.name}</div>
            </div>
            
            <div style="margin-top:20px;">
                <h3>Analysis</h3>
                <p>Evidence suggests prices are ${data.status} due to market conditions.</p>
            </div>
        `;

        return renderLayout(data.title, content);
    }
}
