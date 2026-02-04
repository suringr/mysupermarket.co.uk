
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

export interface GenericSignal {
    [key: string]: any;
}

export interface ProviderOutput {
    id: string;
    title: string;
    type: string;
    region: "uk";
    status: string; // "rising" | "stable" | "easing" | "alert" | "safe"
    confidence: Confidence;
    last_checked_utc: string; // ISO
    source: ProviderSource;

    // Domain Specific Signals
    signal?: PricePressureSignal | InflationSignal | GenericSignal;
    items?: any[]; // For lists like alerts
    last_official_update?: string; // Date of official data

    // Failure / Fallback
    reason?: string;
    fetch_mode?: "http" | "browser";
}

export interface ProviderMetadata {
    id: string;
    title: string;
    type: string;
    source: ProviderSource;
}
