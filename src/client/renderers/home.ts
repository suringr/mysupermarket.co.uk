import { fetchData } from "../data";
import { renderLayout } from "../layout";
import { ProviderOutput, Confidence } from "../../scripts/lib/types";

export async function renderHome(): Promise<string> {
    // Parallel fetch for speed
    const [inflation, alerts] = await Promise.all([
        fetchData("uk.food-inflation"),
        fetchData("uk.food-alerts")
    ]);

    // We also want "Price Pressure" examples. 
    // In a real app we might fetch a list or "uk.price-pressure.index".
    // For now, let's fetch "uk.eggs.pressure" as a representative or just link to the hub.
    // The previous homepage had specific cards.

    // Card 1: Price Pressure
    // We can hardcode the "Hub" status or try to fetch a summary.
    // Let's assume we link to /price-pressure

    // Card 2: Inflation
    const inflationVal = inflation?.signal?.food_inflation_yoy_percent
        ? `${inflation.signal.food_inflation_yoy_percent}%`
        : "--";
    const inflationStatus = inflation?.status || "unknown";

    // Card 3: Alerts
    const alertCount = Array.isArray(alerts?.items) ? alerts.items.length : 0;
    const alertStatus = alertCount > 0 ? "Alerts Active" : "No Critical Alerts";

    const content = `
    <div class="signal-grid">
        <!-- Card 1: Price Pressure -->
        <a href="/price-pressure" class="card" style="text-decoration:none; color:inherit; display:block; border-left: 5px solid #2196f3;">
            <h3>Price Pressure</h3>
            <div class="signal-value">High</div>
            <div class="meta">Tracking core commodities</div>
            <div style="margin-top:10px; color:#2196f3; font-weight:bold; font-size:0.9rem;">View Analysis &rarr;</div>
        </a>

        <!-- Card 2: Inflation -->
        <a href="/inflation-trends" class="card" style="text-decoration:none; color:inherit; display:block; border-left: 5px solid ${getColor(inflationStatus)};">
            <h3>UK Food Inflation</h3>
            <div class="signal-value ${getTrendClass(inflationStatus)}">${inflationVal}</div>
            <div class="meta">Official ONS Data</div>
            <div style="margin-top:10px; color:#2196f3; font-weight:bold; font-size:0.9rem;">View Trends &rarr;</div>
        </a>

        <!-- Card 3: Alerts -->
        <a href="/alerts" class="card" style="text-decoration:none; color:inherit; display:block; border-left: 5px solid ${alertCount > 0 ? '#d32f2f' : '#388e3c'};">
            <h3>Safety Alerts</h3>
            <div class="signal-value">${alertCount} Active</div>
            <div class="meta">Recalls & Allergy Warnings</div>
            <div style="margin-top:10px; color:#2196f3; font-weight:bold; font-size:0.9rem;">View Alerts &rarr;</div>
        </a>
    </div>
    `;

    return renderLayout("Dashboard", content, false);
}

function getColor(status: string): string {
    if (status === 'rising' || status === 'alert') return '#d32f2f'; // Red
    if (status === 'easing' || status === 'safe') return '#388e3c'; // Green
    return '#f57c00'; // Orange
}

function getTrendClass(status: string): string {
    if (status === 'rising') return 'trend-up';
    if (status === 'easing') return 'trend-down';
    return 'trend-flat';
}
