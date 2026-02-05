/**
 * Entity configuration for detail pages
 * Defines which entities get dedicated detail pages under each hub
 */

export interface EntityConfig {
    id: string;
    title: string;
    hub: "price-pressure" | "inflation-trends" | "alerts-recalls";
}

export const ENTITIES: EntityConfig[] = [
    {
        id: "eggs",
        title: "Eggs",
        hub: "price-pressure",
    },
    // Add more entities as needed
    // { id: "milk", title: "Milk", hub: "price-pressure" },
    // { id: "bread", title: "Bread", hub: "price-pressure" },
];

// Helper: Get entities by hub for validation in router
export const ENTITIES_BY_HUB = ENTITIES.reduce((acc, e) => {
    if (!acc[e.hub]) acc[e.hub] = [];
    acc[e.hub].push(e);
    return acc;
}, {} as Record<string, EntityConfig[]>);

