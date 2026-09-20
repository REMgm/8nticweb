import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const columns = ["name", "email", "status", "consent_version", "consent_at", "source", "created_at", "updated_at"];
const outputIndex = process.argv.indexOf("--output");
const output = resolve(outputIndex >= 0 ? process.argv[outputIndex + 1] || "" : `.data/beta-eligible-${new Date().toISOString().slice(0, 10)}.csv`);
let records: Record<string, unknown>[] = [];

if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
  const secret = process.env.SUPABASE_SECRET_KEY;
  const url = new URL("/rest/v1/beta_signups", process.env.SUPABASE_URL);
  if (url.protocol !== "https:") throw new Error("An HTTPS database URL is required.");
  url.searchParams.set("select", columns.join(","));
  url.searchParams.set("status", "eq.eligible");
  url.searchParams.set("order", "id.asc");
  url.searchParams.set("limit", "1000");
  for (let offset = 0; ; offset += 1000) {
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, {
      headers: { apikey: secret, ...(secret.startsWith("eyJ") ? { Authorization: `Bearer ${secret}` } : {}) },
      signal: AbortSignal.timeout(10000), cache: "no-store",
    });
    if (!response.ok) throw new Error("Authorized export could not be completed.");
    const page = await response.json() as Record<string, unknown>[];
    if (!Array.isArray(page)) throw new Error("Unrecognized database response.");
    records.push(...page);
    if (page.length < 1000) break;
  }
} else {
  if (process.env.NODE_ENV === "production") throw new Error("Production database is not configured.");
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(resolve(process.env.BETA_LOCAL_DB_PATH || ".data/beta-signups.sqlite"), { readOnly: true });
  try { records = db.prepare(`SELECT ${columns.join(",")} FROM beta_signups WHERE status = 'eligible' ORDER BY id`).all(); }
  finally { db.close(); }
}

function cell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@\-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
const csv = [columns.map(cell).join(","), ...records.map((record) => columns.map((key) => cell(record[key])).join(","))].join("\r\n") + "\r\n";
await mkdir(dirname(output), { recursive: true, mode: 0o700 });
await writeFile(output, csv, { flag: "wx", mode: 0o600 });
console.log(`Exported ${records.length} eligible rows to ${output}. Recheck preferences before sending.`);
