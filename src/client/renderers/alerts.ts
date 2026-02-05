import { fetchData } from "../data";
import { renderLayout } from "../layout";

const PAGE_SIZE = 10;

export async function renderAlerts(slugOrPage?: string): Promise<string> {
    // 1. Fetch data
    const data = await fetchData("alerts");
    const items = data?.items || [];
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

    // 2. Parse Page
    // If slugOrPage is "page", we might rely on the router passing the actual number, 
    // but app.ts usually passes the segment. 
    // Actually, usually app.ts handles parsing. Let's assume the argument passed IS the slug or page string.
    // For this implementation, let's assume app.ts calls renderAlerts(pageNumberString).

    let currentPage = 1;
    if (slugOrPage) {
        const p = parseInt(slugOrPage, 10);
        if (!isNaN(p)) currentPage = p;
    }

    // 3. Edge Case: Page out of bounds
    if (currentPage < 1 || currentPage > totalPages) {
        return renderLayout("Page Not Found", `
            <div class="container" style="text-align:center; padding:50px 0;">
                <h2>Page Not Found</h2>
                <p>The requested page of alerts does not exist.</p>
                <div class="action-link"><a href="/alerts">Return to Safety Alerts</a></div>
            </div>
        `);
    }

    // 4. Slice Data
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = items.slice(start, end);
    const lastUpdate = data?.last_official_update ? new Date(data.last_official_update).toLocaleDateString() : "Unknown";

    // 5. Render Items
    const listHtml = pageItems.length > 0 ? pageItems.map((item: any) => {
        const dateStr = item.modified || item.created;
        const displayDate = dateStr ? new Date(dateStr).toLocaleDateString() : "Unknown";
        const link = item.alert_url && (item.alert_url.startsWith("http://") || item.alert_url.startsWith("https://"))
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

    // 6. Pagination Controls
    let navHtml = "";
    if (totalPages > 1) {
        const prevLink = currentPage === 2 ? "/alerts" : `/alerts/page/${currentPage - 1}`;
        const nextLink = `/alerts/page/${currentPage + 1}`;

        navHtml = `<div class="pagination" style="display:flex; justify-content:space-between; margin-top:20px; padding-top:20px; border-top:1px solid #eee;">`;

        // Prev
        if (currentPage > 1) {
            navHtml += `<a href="${prevLink}" class="btn">&larr; Newer</a>`;
        } else {
            navHtml += `<span></span>`; // Spacer
        }

        // Info
        navHtml += `<span class="meta">Page ${currentPage} of ${totalPages}</span>`;

        // Next
        if (currentPage < totalPages) {
            navHtml += `<a href="${nextLink}" class="btn">Older &rarr;</a>`;
        } else {
            navHtml += `<span></span>`; // Spacer
        }

        navHtml += `</div>`;
    }

    // 7. Page Title
    const pageTitle = currentPage > 1 ? `Safety Alerts (Page ${currentPage})` : "Safety Alerts";

    const content = `
        <div style="margin-bottom:30px;">
            <h2>${pageTitle}</h2>
            <p class="meta">Official recalls & allergy warnings from the UK Food Standards Agency (FSA).</p>
            <p class="meta">Last Official Update: ${lastUpdate}</p>
        </div>
        <div class="signal-grid" style="grid-template-columns: 1fr;"> 
            ${listHtml}
        </div>
        ${navHtml}
    `;

    return renderLayout(pageTitle, content);
}
