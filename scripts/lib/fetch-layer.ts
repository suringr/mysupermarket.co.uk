
import { FailureType } from "./types";

const MAX_RETRIES = 2;
const DEFAULT_TIMEOUT = 10000;

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
];

function getRandomUserAgent(): string {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export interface FetchOptions {
    timeout?: number;
    retries?: number;
    headers?: Record<string, string>;
    providerId?: string;
}

export interface FetchResult {
    ok: boolean;
    status: number;
    text: string;
    url?: string;
    error?: string;
    failureType?: FailureType;
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchHtml(url: string, options: FetchOptions = {}): Promise<FetchResult> {
    const {
        timeout = DEFAULT_TIMEOUT,
        retries = MAX_RETRIES,
        headers = {},
        providerId
    } = options;

    let lastError: any = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);

            const userAgent = getRandomUserAgent();
            const mergedHeaders = {
                "User-Agent": userAgent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-GB,en;q=0.9",
                ...headers
            };

            if (attempt > 0) {
                console.log(`[Fetch] Retrying ${url} (Attempt ${attempt + 1}/${retries + 1})...`);
            }

            const response = await fetch(url, {
                headers: mergedHeaders,
                signal: controller.signal
            });

            clearTimeout(id);

            // Handle 403 specially - maybe just return immediately to trigger fallback logic upstream?
            // Or retry with different UA?
            if (response.status === 403 || response.status === 429) {
                console.warn(`[Fetch] Blocked/RateLimited (${response.status}) for ${url}`);
                if (attempt < retries) {
                    await sleep(1000 * Math.pow(2, attempt));
                    continue; // Retry with new UA
                }
            }

            if (response.ok) {
                const text = await response.text();
                return {
                    ok: true,
                    status: response.status,
                    text,
                    url: response.url
                };
            }

            // Non-ok status
            if (attempt === retries) {
                return {
                    ok: false,
                    status: response.status,
                    text: "",
                    error: `HTTP ${response.status}`,
                    failureType: (response.status === 403 || response.status === 429) ? FailureType.Blocked : FailureType.Unavailable
                };
            }

        } catch (err: any) {
            console.error(`[Fetch] Error fetching ${url}: ${err.message}`);
            lastError = err;
            if (attempt === retries) break;

            const isAbort = err.name === 'AbortError';
            if (isAbort) {
                // Timeouts are worth retrying
            }

            await sleep(1000 * Math.pow(2, attempt));
        }
    }

    return {
        ok: false,
        status: 0,
        text: "",
        error: lastError?.message || "Unknown error",
        failureType: lastError?.name === 'AbortError' ? FailureType.NetworkError : FailureType.NetworkError
    };
}
