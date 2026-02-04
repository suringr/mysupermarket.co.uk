import { fetchData } from "../data";
import { renderLayout } from "../layout";
import { ProviderOutput, InflationNotice } from "../../scripts/lib/types";

export async function renderInflation(): Promise<string> {
    const [metrics, noticesProvider] = await Promise.all([
        fetchData("uk.food-inflation"),
        fetchData("uk.inflation.notices")
    ]);

    // Metrics
    const yoy = metrics?.signal?.food_inflation_yoy_percent;
    const yoyFormatted = yoy ? `${yoy}%` : "--";
    const status = metrics?.status || "unknown";
    const period = metrics?.signal?.period || "Unknown";

    const cardHtml = `
            <div class="card">
                <h3>UK Food Inflation (YoY)</h3>
                <div class="signal-value ${getTrendClass(status)}">${yoyFormatted}</div>
                <div class="meta">Reference Period: ${period}</div>
            </div>
            <!-- Placeholder for MoM or other macro metrics -->
             <div class="card" style="opacity:0.6;">
                <h3>Month-on-Month</h3>
                <div class="signal-value">--</div>
                <div class="meta">Coming Soon</div>
            </div>
    `;

    // Notices
    let noticesHtml = "";
    if (noticesProvider && Array.isArray(noticesProvider.items)) {
        noticesHtml = (noticesProvider.items as InflationNotice[]).map((n: InflationNotice) => `
            <a href="${n.url}" target="_blank" class="card" style="text-decoration:none; color:inherit; display:block;">
                <h3>${n.title}</h3>
                <div class="meta">${formatDate(n.date)} • ${n.source_name}</div>
                <p style="margin-top:10px; font-size:0.9rem;">${n.summary || ''}</p>
                <div style="margin-top:10px; color:#2196f3; font-weight:bold; font-size:0.9rem;">View Notice &nearr;</div>
            </a>
        `).join("");
    } else {
        noticesHtml = `<div class="card"><p>No recent notices available.</p></div>`;
    }

    const content = `
        <h2>Inflation Metrics</h2>
        <div class="signal-grid" style="margin-top:20px; margin-bottom: 50px;">
            ${cardHtml}
        </div>

        <h2>Inflation Notices</h2>
        <p class="meta" style="margin-bottom:20px;">Official updates from ONS, DEFRA, and GOV.UK</p>
        <div class="signal-grid">
            ${noticesHtml}
        </div>
        
        <div style="margin-top:40px;">
            <h3>Source Data</h3>
            <p>Derived from <a href="https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7c8/mm23/data">Office for National Statistics</a> (CPI).</p>
        </div>
    `;

    return renderLayout("Inflation Trends", content);
}

function getTrendClass(status: string): string {
    if (status === 'rising') return 'trend-up';
    if (status === 'easing') return 'trend-down';
    return 'trend-flat';
}

function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString();
    } catch {
        return iso;
    }
}
