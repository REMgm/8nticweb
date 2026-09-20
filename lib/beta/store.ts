import type { BetaSignup } from "./validation.ts";

export type SaveResult = { outcome: "received" } | { outcome: "rate_limited"; retryAfter: number };
export type RateKeys = { ipKey: string; emailKey: string };
export interface BetaStore {
  save(signup: BetaSignup, keys: RateKeys): Promise<SaveResult>;
}

export function createSupabaseStore(url: string, secret: string, fetcher: typeof fetch = fetch): BetaStore {
  return {
    async save(signup, keys) {
      const response = await fetcher(`${url.replace(/\/$/, "")}/rest/v1/rpc/submit_beta_signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: secret,
          ...(secret.startsWith("eyJ") ? { Authorization: `Bearer ${secret}` } : {}),
        },
        body: JSON.stringify({
          p_name: signup.name, p_email: signup.email, p_consent_version: signup.consentVersion,
          p_ip_key: keys.ipKey, p_email_key: keys.emailKey,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("Beta persistence unavailable");
      const result: unknown = await response.json();
      if (result && typeof result === "object" && "outcome" in result) {
        if (result.outcome === "received") return { outcome: "received" };
        if (result.outcome === "rate_limited" && "retryAfter" in result &&
            typeof result.retryAfter === "number" && Number.isFinite(result.retryAfter)) {
          return { outcome: "rate_limited", retryAfter: Math.max(1, Math.ceil(result.retryAfter)) };
        }
      }
      throw new Error("Beta persistence response not confirmed");
    },
  };
}
