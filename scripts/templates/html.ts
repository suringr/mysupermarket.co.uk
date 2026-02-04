
import { ProviderOutput } from "../lib/types";

export function layout(title: string, content: string): string {
    const lastBuild = new Date().toUTCString();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Track official UK supermarket trends and food alerts — no predictions. Real-time monitoring of FSA alerts, food inflation, and price pressure indicators.">
    <meta property="og:title" content="MySupermarket - UK Food Trends Tracker">
    <meta property="og:description" content="Track official UK supermarket trends and food alerts — no predictions">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mysupermarket.co.uk">
    <title>${title} | MySupermarket Stats</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="apple-touch-icon" href="/favicon.png">
    <link rel="stylesheet" href="/assets/styles.css">

</head>
<body>
    <div class="container">
        <header>
            <h1><a href="/">MySupermarket Status</a></h1>
            <div class="meta">Last Build: ${lastBuild}</div>
        </header>
        <main>
            ${content}
        </main>
        <footer class="disclaimer">
            <p>Official signals only. Not retail price comparison.</p>
            <p>Data sources: FSA, ONS.</p>
        </footer>
    </div>
</body>
</html>`;
}

export function homepage(data: ProviderOutput[]): string {
    // Sort logic? Keep strict order: Alerts, Inflation, Eggs
    const order = ["uk.food-alerts", "uk.food-inflation", "uk.eggs.pressure"];
    const sorted = data.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

    const cards = sorted.map(item => {
        let valueDisplay = item.status;
        let link = "/";

        if (item.id === "uk.food-alerts") {
            const count = item.items?.length || 0;
            valueDisplay = `${count} Active Alerts`;
            link = "/status/food-alerts/";
        } else if (item.id === "uk.food-inflation") {
            valueDisplay = `${item.signal?.food_inflation_yoy_percent}% YoY`;
            link = "/trends/food-inflation/";
        } else if (item.id === "uk.eggs.pressure") {
            valueDisplay = `${item.status.toUpperCase()} (${item.signal?.yoy_percent}% YoY)`;
            link = "/prices/eggs/";
        }

        return `
        <a href="${link}" class="card">
            <h2>${item.title}</h2>
            <div class="status ${item.status}">${valueDisplay}</div>
            <div class="meta">
                <span>Confidence: ${item.confidence}</span>
                <span>Updated: ${new Date(item.last_checked_utc).toLocaleDateString()}</span>
            </div>
        </a>`;
    }).join("");

    return `
        <div class="grid">
            ${cards}
        </div>
    `;
}

export function statusPage(item: ProviderOutput): string {
    let detailSection = "";

    if (item.id === "uk.food-alerts") {
        const list = (item.items || []).map((alert: any) => `
            <li>
                <a href="${alert.url}" target="_blank">
                    <strong>${alert.title}</strong>
                </a>
                <br>
                <span class="meta">${new Date(alert.date_utc).toLocaleDateString()}</span>
            </li>
        `).join("");
        detailSection = `<ul>${list}</ul>`;
    } else if (item.id === "uk.food-inflation") {
        detailSection = `
            <div class="card">
                <h3>Current Inflation</h3>
                <p style="font-size: 2rem; font-weight: bold;">${item.signal?.food_inflation_yoy_percent}%</p>
                <p class="meta">Period: ${item.signal?.period}</p>
            </div>
        `;
    } else if (item.id === "uk.eggs.pressure") {
        detailSection = `
            <div class="card">
                <h3>Market Pressure</h3>
                <p style="font-size: 2rem; font-weight: bold; text-transform: uppercase;">${item.status}</p>
                <p>Year-on-Year Change: ${item.signal?.yoy_percent}%</p>
                <p class="meta">Period: ${item.signal?.period}</p>
            </div>
        `;
    }

    return `
        <a href="/" class="back-link">← Back to Dashboard</a>
        <h2>${item.title}</h2>
        <div class="meta">
            Source: <a href="${item.source.url}" target="_blank">${item.source.name}</a>
        </div>
        <div style="margin-top: 20px;">
            ${detailSection}
        </div>
        <div class="meta" style="margin-top: 40px;">
             Technical Status: ${item.status} | Confidence: ${item.confidence}
             <br>
             Last Checked: ${item.last_checked_utc}
        </div>
    `;
}
