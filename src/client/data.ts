import { ProviderOutput } from "../../scripts/lib/types";

// Basic in-memory cache for meta to avoid fetching it every single time we click a link?
// Actually, we want fresh data on navigation.
let cacheVersion: string | null = null;

export async function fetchMeta(): Promise<{ lastUpdated: string } | null> {
    try {
        // Always fetch fresh meta
        const res = await fetch(`/data/_meta.json?t=${Date.now()}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data?.lastUpdated) cacheVersion = new Date(data.lastUpdated).getTime().toString();
        return data;
    } catch {
        return null;
    }
}

export async function fetchRegistry(): Promise<any[] | null> {
    try {
        const v = cacheVersion ? `?v=${cacheVersion}` : `?t=${Date.now()}`;
        const res = await fetch(`/data/_registry.json${v}`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function fetchData(id: string): Promise<ProviderOutput | null> {
    try {
        // Use cacheVersion if available, else timestamp
        const v = cacheVersion ? `?v=${cacheVersion}` : `?t=${Date.now()}`;
        const res = await fetch(`/data/${id}.json${v}`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}
