
export enum Confidence {
    High = "high",
    Medium = "medium",
    Low = "low"
}

export enum FailureType {
    Blocked = "blocked",
    RateLimited = "rate_limited",
    ParseFailed = "parse_failed",
    Unavailable = "unavailable",
    NetworkError = "network_error"
}

export interface ProviderSource {
    name: string;
    url: string;
}

export interface PricePressureSignal {
    yoy_percent: number;
    period: string;
    is_stale: boolean;
    current_price_index?: number;
    price?: number;     // Optional raw price if available
    unit?: string;      // e.g. "per dozen"
}

export interface InflationSignal {
    food_inflation_yoy_percent: number;
    period: string;
    is_stale: boolean;
}

export interface InflationNotice {
    date: string; // ISO-8601 publication date
    title: string;
    url: string;
    source_name: string;
    summary?: string; // optional, 1 factual sentence max
}

export interface GenericSignal {
    [key: string]: any;
}

export type ProviderType = "price-pressure" | "inflation-trends" | "alerts-recalls";

/**
 * Provider output aligned with NextReset data model
 */
export interface ProviderOutput {
    // Core fields (must-have, NextReset-aligned)
    provider_id: string;
    title: string;
    type: ProviderType;
    source_url: string;
    status: "fresh" | "stale" | "unavailable";
    fetched_at_utc: string; // ISO timestamp - current run

    // MySupermarket-specific fields
    region: "uk";

    // Optional fields
    confidence?: Confidence;
    reason?: string;  // Only on stale/unavailable
    failure_type?: FailureType;
    fetch_mode?: "http" | "browser";

    // Domain Specific Signals
    signal?: PricePressureSignal | InflationSignal | GenericSignal;
    items?: any[]; // For lists like alerts
    last_official_update?: string; // Date of official data
    count?: number; // Number of items in list
}

export interface ProviderMetadata {
    provider_id: string;
    title: string;
    type: ProviderType;
    source_url: string;
}
