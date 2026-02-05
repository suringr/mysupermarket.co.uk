import { ENTITIES } from "./entities";

// Hub routes
export const HUB_ROUTES = [
    { path: "/", title: "Home" },
    { path: "/price-pressure/", title: "Price Pressure" },
    { path: "/inflation-trends/", title: "Inflation Trends" },
    { path: "/alerts-recalls/", title: "Alerts & Recalls" },
] as const;

// Hub title lookup (safe, performant)
const HUB_TITLE_BY_PATH = Object.fromEntries(
    HUB_ROUTES.map(r => [r.path, r.title])
);

// Detail routes (derived from ENTITIES)
export const DETAIL_ROUTES = ENTITIES.map(e => ({
    path: `/${e.hub}/${e.id}/`,
    title: `${e.title} - ${HUB_TITLE_BY_PATH[`/${e.hub}/`] ?? e.hub}`,
}));

// Combined (for generator)
export const ALL_ROUTES = [...HUB_ROUTES, ...DETAIL_ROUTES];

// Re-export types for convenience
export type Route = (typeof HUB_ROUTES)[number] | (typeof DETAIL_ROUTES)[number];
