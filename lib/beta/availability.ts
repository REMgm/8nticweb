type Environment = Record<string, string | undefined>;

/** Server-rendered UI readiness, not a database health check or subscription state. */
export function isBetaSignupAvailable(env: Environment = process.env): boolean {
  const production = env.NODE_ENV === "production";
  const databaseUrl = env.SUPABASE_URL?.trim();
  const serverKey = env.SUPABASE_SECRET_KEY?.trim();
  if (!production && !env.SUPABASE_URL && !env.SUPABASE_SECRET_KEY) return true;
  if (!databaseUrl || !serverKey) return false;
  try {
    const url = new URL(databaseUrl);
    const localDatabase = !production && ["localhost", "127.0.0.1"].includes(url.hostname);
    if ((url.protocol !== "https:" && !(localDatabase && url.protocol === "http:")) ||
        url.username || url.password || url.pathname !== "/" || url.search || url.hash) return false;
  } catch { return false; }
  if (!production) return true;
  if ((env.BETA_RATE_LIMIT_SECRET?.trim().length ?? 0) < 32) return false;
  return env.VERCEL === "1" || Boolean(env.BETA_TRUSTED_PROXY_HEADER?.trim());
}
