export function renderLayout(title: string, content: string, showHomeLink: boolean = true): string {
    const homeLinkHtml = showHomeLink
        ? `<div style="margin-bottom: 20px;"><a href="/" class="back-link">← Dashboard</a></div>`
        : '';

    return `
    <div class="container">
        <header style="margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <h1 style="margin:0;"><a href="/" style="text-decoration:none; color:inherit;">MySupermarket Signals</a></h1>
            <div class="meta" id="last-updated">Updating status...</div>
        </header>
        <main>
            ${homeLinkHtml}
            ${content}
        </main>
        <footer class="disclaimer" style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;">
            <p><strong>Official Signals Only.</strong> Not a retail price comparison site.</p>
            <p>Data sources: Office for National Statistics (ONS), Food Standards Agency (FSA), DEFRA.</p>
        </footer>
    </div>
    `;
}

export function updateMetaDate(dateString: string) {
    const el = document.getElementById("last-updated");
    if (el) {
        try {
            const date = new Date(dateString);
            el.textContent = `Official UK Food Data • Last Updated: ${date.toUTCString()}`;
        } catch {
            el.textContent = "Official UK Food Data";
        }
    }
}
