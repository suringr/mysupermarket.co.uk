export const ROUTES = [
    { path: "/", title: "Home" },
    { path: "/price-pressure/", title: "Price Pressure" },
    { path: "/inflation-trends/", title: "Inflation Trends" },
    { path: "/alerts-recalls/", title: "Alerts & Recalls" },
] as const;

// Re-export types for convenience
export type Route = (typeof ROUTES)[number];
