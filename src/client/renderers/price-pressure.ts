import { fetchData } from "../data";
import { renderLayout } from "../layout";
import { ProviderOutput } from "../../../scripts/lib/types";

/**
 * Safely format ISO date strings for display.
 * Fallback to "Unknown" for invalid or missing dates.
 */
function formatDate(dateStr?: string): string {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Unknown";

    // Using YYYY-MM-DD for stability as requested
    return date.toISOString().slice(0, 10);
}

export async function renderPricePressure(slug?: string): Promise<string> {
    if (!slug) {
        // Hub view - List all signals
        // For now, we only have one known: Eggs
        const eggs = await fetchData("uk.eggs.pressure");
        const signals = [eggs].filter(Boolean) as ProviderOutput[];

        const listHtml = signals.map(s => {
            const displayDate = formatDate(s.last_official_update || s.fetched_at_utc);
            const statusStr = (s.status as string);
            return `
                <a href="/price-pressure/eggs/" class="card" style="text-decoration:none; color:inherit; display:block;">
                    <h3>${s.title}</h3>
                    <div class="signal-value ${statusStr === 'rising' ? 'trend-up' : 'trend-flat'}">${statusStr.toUpperCase()}</div>
                    <div class="meta">Updated: ${displayDate}</div>
                </a>
            `;
        }).join("");

        return renderLayout("Price Pressure Hub", `
            <div class="signal-grid">
                ${listHtml}
            </div>
        `);
    } else {
        // Detail view - Load entity-specific data
        // Using naming convention: price-pressure.<entity>
        // Map slug to data file ID
        let id = "";
        if (slug === "eggs") id = "uk.eggs.pressure";

        if (!id) return renderLayout("Not Found", "<p>Signal not found.</p>");

        const data = await fetchData(id);
        if (!data) return renderLayout("Not Found", "<p>Data unavailable.</p>");

        const signal = data.signal as any;
        const statusStr = (data.status as string);
        const trend = statusStr === 'rising' ? 'High / Rising' : 'Stable';

        const sourceUrl = data.source_url;
        const isLink = sourceUrl && (sourceUrl.startsWith("http://") || sourceUrl.startsWith("https://"));
        const sourceHtml = isLink
            ? `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceUrl}</a>`
            : (sourceUrl || "Unknown");

        const content = `
            <div class="card">
                <h2>${data.title}</h2>
                <div class="signal-value ${data.status === 'rising' ? 'trend-up' : 'trend-flat'}">${trend}</div>
                <p><strong>YoY Increase:</strong> ${signal?.yoy_percent || '--'}%</p>
                <p><strong>Current Price:</strong> £${signal?.price || '--'} (${signal?.unit || ''})</p>
                <div class="meta">Source: ${sourceHtml}</div>
            </div>
            
            <div style="margin-top:20px;">
                <h3>Analysis</h3>
                <p>Evidence suggests prices are ${data.status} due to market conditions.</p>
            </div>
        `;

        return renderLayout(data.title, content);
    }
}
