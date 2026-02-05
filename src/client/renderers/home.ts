import { fetchData } from "../data";
import { renderLayout } from "../layout";
import { ProviderOutput, Confidence, InflationSignal } from "../../../scripts/lib/types";

export async function renderHome(): Promise<string> {
    // Parallel fetch for speed
    const [inflation, alerts] = await Promise.all([
        fetchData("uk.food-inflation"),
        fetchData("alerts")
    ]);

    // We also want "Price Pressure" examples. 
    // In a real app we might fetch a list or "uk.price-pressure.index".
    // For now, let's fetch "uk.eggs.pressure" as a representative or just link to the hub.
    // The previous homepage had specific cards.

    // Card 1: Price Pressure
    // We can hardcode the "Hub" status or try to fetch a summary.
    // Let's assume we link to /price-pressure

    // Card 2: Inflation
    const inflationSignal = inflation?.signal as InflationSignal | undefined;
    const inflationVal = inflationSignal?.food_inflation_yoy_percent
        ? `${inflationSignal.food_inflation_yoy_percent}%`
        : "--";
    const inflationStatus = inflation?.status || "unknown";

    // Card 3: Alerts
    const alertCount = Array.isArray(alerts?.items) ? alerts.items.length : 0;
    const alertStatus = alertCount > 0 ? "Alerts Active" : "No Critical Alerts";

    const content = `
    <div class="signal-grid">
        <!-- Card 1: Price Pressure -->
        <a href="/price-pressure" class="card border-left-info">
            <h3>Price Pressure</h3>
            <div class="signal-value">High</div>
            <div class="meta">Tracking core commodities</div>
            <div class="action-link">View Analysis &rarr;</div>
        </a>

        <!-- Card 2: Inflation -->
        <a href="/inflation-trends" class="card ${getBorderClass(inflationStatus)}">
            <h3>UK Food Inflation</h3>
            <div class="signal-value ${getTrendClass(inflationStatus)}">${inflationVal}</div>
            <div class="meta">Official ONS Data</div>
            <div class="action-link">View Trends &rarr;</div>
        </a>

        <!-- Card 3: Alerts -->
        <a href="/alerts" class="card ${alertCount > 0 ? 'border-left-bad' : 'border-left-good'}">
            <h3>Safety Alerts</h3>
            <div class="signal-value" style="font-size: 1.5rem;">${alertCount} Notices</div>
            <div class="meta">Recalls & Allergy Warnings</div>
            <div class="action-link">Latest Updates &rarr;</div>
        </a>
    </div>
    `;

    return renderLayout("Dashboard", content, false);
}

function getBorderClass(status: string): string {
    if (status === 'rising' || status === 'alert') return 'border-left-bad';
    if (status === 'easing' || status === 'safe') return 'border-left-good';
    return 'border-left-warn';
}

function getTrendClass(status: string): string {
    if (status === 'rising') return 'trend-up';
    if (status === 'easing') return 'trend-down';
    return 'trend-flat';
}
