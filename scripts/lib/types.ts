
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

export interface ProviderOutput {
    id: string;
    title: string;
    type: string;
    region: "uk";
    status: string; // domain-specific (e.g., "fresh", "rising", "alert")
    confidence: Confidence;
    last_checked_utc: string; // ISO
    source: ProviderSource;

    // Optional / Domain Specific
    signal?: Record<string, any>; // For inflation/trends
    items?: any[]; // For lists like alerts
    last_official_update?: string; // Date of official data

    // Failure / Fallback
    reason?: string; // Failure reason if confidence is low or status is unknown/fallback
    fetch_mode?: "http" | "browser"; // Debug info
}

export interface ProviderMetadata {
    id: string;
    title: string;
    type: string;
    source: ProviderSource;
}
