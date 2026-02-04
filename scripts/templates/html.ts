
import { ProviderOutput, PricePressureSignal, InflationSignal } from "../lib/types";

export function layout(title: string, content: string, showHomeLink: boolean = true): string {
    const lastBuild = new Date().toUTCString();
    const homeLink = showHomeLink ? `<div style="margin-bottom: 20px;"><a href="/" class="back-link">← Dashboard</a></div>` : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="UK Food Signals Dashboard: Official price pressure, inflation trends, and food alerts.">
    <title>${title} | MySupermarket Signals</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/assets/styles.css">
    <style>
        .signal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .hub-nav { display: flex; gap: 20px; margin-bottom: 30px; }
        .signal-value { font-size: 2.5rem; font-weight: bold; margin: 10px 0; }
        .trend-up { color: #d32f2f; } /* Red for bad/rising */
        .trend-down { color: #388e3c; } /* Green for good/easing */
        .trend-flat { color: #f57c00; } /* Orange for stable */
        .confidence-pill { background: #eee; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
    </style>
</head>
<body>
    <div class="container">
        <header style="margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <h1 style="margin:0;"><a href="/" style="text-decoration:none; color:inherit;">MySupermarket Signals</a></h1>
            <div class="meta">Official UK Food Data • Last Updated: ${lastBuild}</div>
        </header>
        <main>
            ${homeLink}
            ${content}
        </main>
        <footer class="disclaimer" style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;">
            <p><strong>Official Signals Only.</strong> Not a retail price comparison site.</p>
            <p>Data sources: Office for National Statistics (ONS), Food Standards Agency (FSA).</p>
        </footer>
    </div>
</body>
</html>`;
}

export function homepage(): string {
    return `
        <div class="intro" style="text-align:center; margin-bottom:40px;">
            <p style="font-size:1.2rem;">Tracking official indicators for UK food prices and safety.</p>
        </div>
        <div class="signal-grid">
            <!-- Card 1: Price Pressure -->
            <a href="/price-pressure/" class="card" style="text-decoration:none; color:inherit; display:block; border-left: 5px solid #2196f3;">
                <h2>Price Pressure</h2>
                <div class="status">Product-level Signals</div>
                <p class="meta">Official ONS item indices showing where prices are rising or easing.</p>
                <div style="margin-top:10px; color:#2196f3; font-weight:bold;">View Hub &rarr;</div>
            </a>

            <!-- Card 2: Inflation Trends -->
            <a href="/inflation-trends/" class="card" style="text-decoration:none; color:inherit; display:block; border-left: 5px solid #9c27b0;">
                <h2>Inflation Trends</h2>
                <div class="status">Macro Indicators</div>
                <p class="meta">Headline food inflation rates and month-on-month trends.</p>
                <div style="margin-top:10px; color:#9c27b0; font-weight:bold;">View Hub &rarr;</div>
            </a>

            <!-- Card 3: Alerts -->
            <a href="/alerts/" class="card" style="text-decoration:none; color:inherit; display:block; border-left: 5px solid #f44336;">
                <h2>Alerts & Recalls</h2>
                <div class="status">Safety Signals</div>
                <p class="meta">Real-time feed of FSA product recalls and allergy alerts.</p>
                <div style="margin-top:10px; color:#f44336; font-weight:bold;">View Hub &rarr;</div>
            </a>
        </div>
    `;
}

export function pricePressureHub(products: ProviderOutput[]): string {
    const productCards = products.map(p => {
        const signal = p.signal as PricePressureSignal;
        const trendClass = p.status === 'rising' ? 'trend-up' : (p.status === 'easing' ? 'trend-down' : 'trend-flat');

        return `
        <a href="/price-pressure/${p.title.toLowerCase()}/" class="card" style="text-decoration:none; color:inherit;">
            <h3>${p.title}</h3>
            <div class="signal-value ${trendClass}">${p.status.toUpperCase()}</div>
            <div class="meta">
                <span class="confidence-pill">Confidence: ${p.confidence}</span>
                <span>${signal?.yoy_percent}% YoY</span>
            </div>
            <div class="meta" style="margin-top:10px;">Updated: ${new Date(p.last_official_update || "").toLocaleDateString()}</div>
        </a>`;
    }).join("");

    return `
        <h2>Food Price Pressure</h2>
        <p>Product-level indicators derived from ONS item price indices (MM23).</p>
        <div class="signal-grid" style="margin-top:30px;">
            ${productCards}
        </div>
    `;
}

export function productDetail(item: ProviderOutput): string {
    const signal = item.signal as PricePressureSignal;
    const trendClass = item.status === 'rising' ? 'trend-up' : (item.status === 'easing' ? 'trend-down' : 'trend-flat');

    return `
        <div class="card">
            <h1>${item.title}</h1>
            <div class="signal-value ${trendClass}">${item.status.toUpperCase()}</div>
            <p style="font-size:1.5rem;">${signal.yoy_percent}% <span class="meta">Year-over-Year Change</span></p>
            
            <div style="margin-top:30px; padding:20px; background:#f9f9f9; border-radius:8px;">
                <h3>Signal Metadata</h3>
                <ul style="list-style:none; padding:0;">
                    <li><strong>Confidence:</strong> ${item.confidence}</li>
                    <li><strong>Last Official Update:</strong> ${new Date(item.last_official_update || "").toLocaleDateString()}</li>
                    <li><strong>Reference Period:</strong> ${signal.period}</li>
                    <li><strong>Source:</strong> <a href="${item.source.url}">${item.source.name}</a></li>
                </ul>
            </div>

            <div style="margin-top:20px;">
                <p class="meta"><strong>Methodology:</strong> Comparison of the latest ONS indices against the same month last year. >2% is Rising, <-2% is Easing.</p>
            </div>
        </div>
    `;
}

export function inflationTrendsHub(item: ProviderOutput, noticesProvider?: ProviderOutput): string {
    const signal = item.signal as InflationSignal;
    const notices = noticesProvider?.items || [];
    const hasNotices = notices.length > 0;

    const noticeCards = hasNotices
        ? notices.map((n: any) => `
            <a href="${n.url}" target="_blank" class="card" style="text-decoration:none; color:inherit; display:block;">
                <h3>${n.title}</h3>
                <div class="meta">${new Date(n.date).toLocaleDateString()} • ${n.source_name}</div>
                ${n.summary ? `<p style="margin-top:10px; font-size:0.9rem;">${n.summary}</p>` : ''}
                <div style="margin-top:10px; color:#2196f3; font-weight:bold; font-size:0.9rem;">View Notice &nearr;</div>
            </a>
        `).join("")
        : `<p class="meta">No notices yet.</p>`;

    return `
        <h2>Inflation Metrics</h2>
        <div class="signal-grid" style="margin-top:20px; margin-bottom: 50px;">
            <div class="card">
                <h3>UK Food Inflation (YoY)</h3>
                <div class="signal-value trend-up">${signal.food_inflation_yoy_percent}%</div>
                <div class="meta">Reference Period: ${signal.period}</div>
            </div>
            <!-- Placeholder for MoM or other macro metrics -->
             <div class="card" style="opacity:0.6;">
                <h3>Month-on-Month</h3>
                <div class="signal-value">--</div>
                <div class="meta">Coming Soon</div>
            </div>
        </div>

        <h2>Inflation Notices</h2>
        <p class="meta" style="margin-bottom:20px;">Official updates from ONS, DEFRA, and GOV.UK</p>
        <div class="signal-grid">
            ${noticeCards}
        </div>
        
        <div style="margin-top:40px;">
            <h3>Source Data</h3>
            <p>Derived from <a href="${item.source.url}">${item.source.name}</a> (CPI).</p>
            <p>Last Updated: ${new Date(item.last_official_update || "").toLocaleDateString()}</p>
        </div>
    `;
}

export function alertsHub(item: ProviderOutput): string {
    // Just the gateway cards for alerts
    const activeCount = item.items?.length || 0;

    return `
        <h2>Alerts & Recalls</h2>
        <p>Official FSA food alerts from the last 30 days.</p>
        <p class="meta">Total Active: ${activeCount}</p>

        <div class="signal-grid" style="margin-top:30px;">
            <a href="/alerts/all/" class="card" style="text-decoration:none; color:inherit;">
                <h3>Latest Alerts (All)</h3>
                <div class="signal-value">${activeCount}</div>
                <div class="meta">View Full List &rarr;</div>
            </a>
            
            <a href="/alerts/allergy/" class="card" style="text-decoration:none; color:inherit;">
                <h3>Allergy Alerts</h3>
                <div class="status">Allergens/Mislabeled</div>
                <div class="meta">View List &rarr;</div>
            </a>

            <a href="/alerts/recalls/" class="card" style="text-decoration:none; color:inherit;">
                <h3>Product Recalls</h3>
                <div class="status">Safety Risks</div>
                <div class="meta">View List &rarr;</div>
            </a>
        </div>
    `;
}

export function alertsList(item: ProviderOutput, category: string): string {
    let items = item.items || [];
    let title = "Latest Alerts";

    if (category === 'allergy') {
        items = items.filter(i => i.title.toLowerCase().includes('allerag') || i.title.toLowerCase().includes('allergy') || i.summary?.toLowerCase().includes('allergy')); // Basic filter
        title = "Allergy Alerts";
    } else if (category === 'recalls') {
        items = items.filter(i => i.title.toLowerCase().includes('recall'));
        title = "Product Recalls";
    }

    const listHtml = items.map((alert: any) => `
        <div class="card" style="margin-bottom:15px; border-left: 3px solid #f44336;">
            <h3><a href="${alert.url}" target="_blank">${alert.title}</a></h3>
            <p class="meta">${new Date(alert.date_utc).toLocaleDateString()}</p>
            <p>${alert.summary || ""}</p>
        </div>
    `).join("");

    return `
        <div style="margin-bottom:20px;">
            <a href="/alerts/" class="back-link">← Alerts Hub</a>
        </div>
        <h2>${title}</h2>
        <div style="margin-top:20px;">
            ${items.length > 0 ? listHtml : '<p>No recent alerts found in this category.</p>'}
        </div>
    `;
}
