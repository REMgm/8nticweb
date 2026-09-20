import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { join } from "node:path";
import { createSupabaseStore, type BetaStore, type RateKeys } from "./store.ts";
import { validateSignup, RECEIVED_MESSAGE, UNAVAILABLE_MESSAGE } from "./validation.ts";

type Environment = Record<string, string | undefined>;
type Dependencies = { env?: Environment; store?: BetaStore; now?: () => number };
const BODY_LIMIT = 4096;

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
}

function allowedOrigin(request: Request, env: Environment): boolean {
  const incoming = request.headers.get("origin");
  if (incoming === null) return true;
  const production = env.NODE_ENV === "production";
  const allowed = new Set(["https://8ntic.com", "https://www.8ntic.com"]);
  const addConfigured = (value: string | undefined) => {
    if (!value) return;
    try {
      const url = new URL(value);
      if ((url.protocol === "https:" || (!production && url.protocol === "http:")) &&
          !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash) {
        allowed.add(url.origin);
      }
    } catch { /* Invalid configuration does not widen the allowlist. */ }
  };
  addConfigured(env.SITE_URL);
  if (env.VERCEL === "1") {
    for (const hostname of [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) {
      if (hostname) addConfigured(`https://${hostname}`);
    }
  }
  if (!production) {
    const requestUrl = new URL(request.url);
    allowed.add(requestUrl.origin);
    // Next dev may expose its bind address in Request.url instead of the browser host.
    const loopback = ["localhost", "127.0.0.1", "[::1]", "0.0.0.0"];
    if (loopback.includes(requestUrl.hostname)) {
      for (const hostname of loopback) {
        allowed.add(`${requestUrl.protocol}//${hostname}${requestUrl.port ? `:${requestUrl.port}` : ""}`);
      }
    }
  }
  return allowed.has(incoming);
}

async function readBody(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > BODY_LIMIT) throw new RangeError("Request too large");
  if (!request.body) throw new SyntaxError("Missing body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > BODY_LIMIT) {
        await reader.cancel();
        throw new RangeError("Request too large");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function rateKeys(request: Request, email: string, env: Environment, now: number): RateKeys {
  const production = env.NODE_ENV === "production";
  const secret = env.BETA_RATE_LIMIT_SECRET || (!production ? "local-development-only" : "");
  if (!secret || (production && secret.length < 32)) throw new Error("Rate limit secret missing");
  // Only trust a header replaced by the hosting platform or a configured, trusted proxy.
  const trustedHeader = env.VERCEL === "1" ? "x-forwarded-for" : env.BETA_TRUSTED_PROXY_HEADER;
  const ip = trustedHeader ? request.headers.get(trustedHeader)?.split(",")[0]?.trim() : "127.0.0.1";
  if ((production && !trustedHeader) || !ip || !isIP(ip)) throw new Error("Trusted client address unavailable");
  const day = Math.floor(now / 86400000);
  const hash = (scope: string, value: string) => createHmac("sha256", secret).update(`${day}:${scope}:${value}`).digest("hex");
  return { ipKey: hash("ip", ip), emailKey: hash("email", email.toLowerCase()) };
}

async function configuredStore(env: Environment): Promise<BetaStore> {
  if (Boolean(env.SUPABASE_URL) !== Boolean(env.SUPABASE_SECRET_KEY)) throw new Error("Incomplete database configuration");
  if (env.SUPABASE_URL && env.SUPABASE_SECRET_KEY) {
    const parsed = new URL(env.SUPABASE_URL);
    if (parsed.protocol !== "https:" && !(env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(parsed.hostname))) {
      throw new Error("Database URL must use HTTPS");
    }
    return createSupabaseStore(parsed.origin, env.SUPABASE_SECRET_KEY);
  }
  if (env.NODE_ENV === "production") throw new Error("Production database unconfigured");
  const { createLocalStore } = await import("./sqlite.ts");
  return createLocalStore(join(process.cwd(), ".data", "beta-signups.sqlite"));
}

export async function handleBetaSignup(request: Request, dependencies: Dependencies = {}): Promise<Response> {
  const env = dependencies.env ?? process.env;
  if (!allowedOrigin(request, env)) return json({ message: "Please submit the form from this website." }, 403);
  if ((request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase() !== "application/json") {
    return json({ message: "Please submit the website form." }, 415);
  }
  let input: unknown;
  try { input = await readBody(request); }
  catch (error) { return json({ message: error instanceof RangeError ? "This request is too large." : "Please check your details and try again." }, error instanceof RangeError ? 413 : 400); }
  const result = validateSignup(input);
  if (!result.ok) return json({ message: "Please check the highlighted fields.", errors: result.errors }, 400);
  try {
    const keys = rateKeys(request, result.value.email, env, (dependencies.now ?? Date.now)());
    const store = dependencies.store ?? await configuredStore(env);
    const saved = await store.save(result.value, keys);
    if (saved.outcome === "rate_limited") {
      return json({ message: "A few requests have arrived already. Please wait before trying again." }, 429, { "Retry-After": String(saved.retryAfter) });
    }
    return json({ message: RECEIVED_MESSAGE }, 200);
  } catch {
    // Do not log submitted names, addresses, secrets or database responses.
    return json({ message: UNAVAILABLE_MESSAGE }, 503);
  }
}
