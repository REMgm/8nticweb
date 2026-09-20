import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { validateSignup, CONSENT_VERSION, RECEIVED_MESSAGE } from "../lib/beta/validation.ts";
import { createLocalStore } from "../lib/beta/sqlite.ts";
import { createSupabaseStore } from "../lib/beta/store.ts";
import { handleBetaSignup } from "../lib/beta/server.ts";

const payload = { name: "  Avery Test  ", email: " Avery+test@example.com ", consent: true, consentVersion: CONSENT_VERSION, website: "" };
const signup = { name: "Avery Test", email: "Avery+test@example.com", consent: true as const, consentVersion: CONSENT_VERSION };
const keys = { ipKey: "a".repeat(64), emailKey: "b".repeat(64) };
const request = (body: unknown, headers: Record<string, string> = {}) => new Request("https://8ntic.com/api/beta-signups", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
const localEnvironment = { NODE_ENV: "test" };

test("validation keeps spelling, plus tags, and requires the displayed consent version", () => {
  assert.deepEqual(validateSignup(payload), { ok: true, value: signup });
  for (const invalid of [{ ...payload, consent: false }, { ...payload, consent: "true" }, { ...payload, consentVersion: "old" }, { ...payload, website: "spam" }, { ...payload, email: "bad" }, { ...payload, status: "eligible" }]) {
    assert.equal(validateSignup(invalid).ok, false);
  }
});

test("a durable insert survives a new connection; duplicates preserve withdrawal and suppression", async () => {
  const directory = mkdtempSync(join(tmpdir(), "8ntic-beta-"));
  const path = join(directory, "signups.sqlite");
  try {
    const store = createLocalStore(path, () => 1750000000000);
    assert.deepEqual(await store.save(signup, keys), { outcome: "received" });
    const db = new DatabaseSync(path);
    const before = db.prepare("SELECT * FROM beta_signups").get()!;
    assert.equal(before.email_normalized, "avery+test@example.com");
    db.prepare("UPDATE beta_signups SET status = 'unsubscribed', unsubscribed_at = ?").run("2026-09-20T00:00:00Z");
    db.close();
    assert.deepEqual(await createLocalStore(path, () => 1750000000000).save({ ...signup, name: "Changed name", email: "AVERY+test@EXAMPLE.COM" }, keys), { outcome: "received" });
    const reopened = new DatabaseSync(path);
    const rows = reopened.prepare("SELECT * FROM beta_signups").all();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].name, "Avery Test");
    assert.equal(rows[0].status, "unsubscribed");
    assert.equal(rows[0].consent_at, before.consent_at);
    reopened.prepare("UPDATE beta_signups SET status = 'suppressed', unsubscribed_at = NULL, suppressed_at = ?, suppression_reason = 'do_not_contact'").run("2026-09-20T00:00:00Z");
    reopened.close();
    assert.deepEqual(await store.save({ ...signup, name: "Another name" }, keys), { outcome: "received" });
    const suppressed = new DatabaseSync(path);
    const unchanged = suppressed.prepare("SELECT name, status, suppression_reason FROM beta_signups").get()!;
    assert.equal(unchanged.name, "Avery Test");
    assert.equal(unchanged.status, "suppressed");
    assert.equal(unchanged.suppression_reason, "do_not_contact");
    suppressed.close();
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("shared durable counters limit attempts across store instances", async () => {
  const directory = mkdtempSync(join(tmpdir(), "8ntic-beta-rate-"));
  try {
    const path = join(directory, "signups.sqlite");
    for (let index = 0; index < 3; index++) assert.equal((await createLocalStore(path, () => 1750000000000).save(signup, keys)).outcome, "received");
    const limited = await createLocalStore(path, () => 1750000000000).save(signup, keys);
    assert.equal(limited.outcome, "rate_limited");
    if (limited.outcome === "rate_limited") assert.ok(limited.retryAfter > 0);
    assert.equal((await createLocalStore(path, () => 1750000000000).save({ ...signup, email: "another@example.com" }, { ...keys, emailKey: "c".repeat(64) })).outcome, "received");
    assert.equal((await createLocalStore(path, () => 1750000000000).save({ ...signup, email: "third@example.com" }, { ...keys, emailKey: "d".repeat(64) })).outcome, "rate_limited");
    const db = new DatabaseSync(path);
    assert.equal((db.prepare("SELECT count(*) AS count FROM beta_signups").get() as { count: number }).count, 2);
    db.close();
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("invalid and honeypot requests cannot invoke persistence", async () => {
  let calls = 0;
  const store = { save: async () => { calls++; return { outcome: "received" as const }; } };
  assert.equal((await handleBetaSignup(request({ ...payload, consent: false }), { env: localEnvironment, store })).status, 400);
  assert.equal((await handleBetaSignup(request({ ...payload, website: "robot" }), { env: localEnvironment, store })).status, 400);
  assert.equal(calls, 0);
});

test("endpoint awaits confirmation and returns no subscriber metadata", async () => {
  let confirm!: () => void;
  const gate = new Promise<void>((resolve) => { confirm = resolve; });
  let completed = false;
  const result = handleBetaSignup(request(payload), { env: localEnvironment, store: { save: async () => { await gate; return { outcome: "received" }; } } }).then((response) => { completed = true; return response; });
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(completed, false);
  confirm();
  const response = await result;
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { message: RECEIVED_MESSAGE });
});

test("database failures and unconfigured production fail closed", async () => {
  const failed = await handleBetaSignup(request(payload), { env: localEnvironment, store: { save: async () => { throw new Error("private database details"); } } });
  assert.equal(failed.status, 503);
  assert.ok(!(await failed.text()).includes("private"));
  const unconfigured = await handleBetaSignup(request(payload, { "x-forwarded-for": "192.0.2.1" }), { env: { NODE_ENV: "production", VERCEL: "1", BETA_RATE_LIMIT_SECRET: "x".repeat(32) } });
  assert.equal(unconfigured.status, 503);
});

test("oversize and cross-origin requests rejected, rate response has Retry-After", async () => {
  assert.equal((await handleBetaSignup(request({ ...payload, name: "x".repeat(5000) }), { env: localEnvironment })).status, 413);
  assert.equal((await handleBetaSignup(request(payload, { origin: "https://other.example" }), { env: localEnvironment })).status, 403);
  const response = await handleBetaSignup(request(payload), { env: localEnvironment, store: { save: async () => ({ outcome: "rate_limited", retryAfter: 120 }) } });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "120");
});

test("Supabase accepts only an explicit confirmed RPC response", async () => {
  let headers: Headers | undefined;
  const store = createSupabaseStore("https://example.supabase.co", "sb_secret_test", async (_input, init) => {
    headers = new Headers(init?.headers);
    return Response.json({ outcome: "received" });
  });
  assert.deepEqual(await store.save(signup, keys), { outcome: "received" });
  assert.equal(headers?.get("apikey"), "sb_secret_test");
  assert.equal(headers?.get("authorization"), null);
  await assert.rejects(createSupabaseStore("https://example.supabase.co", "sb_secret_test", async () => Response.json({})).save(signup, keys));
});

test("development accepts the browser loopback origin when Next exposes its bind address", async () => {
  const store = { save: async () => ({ outcome: "received" as const }) };
  for (const origin of ["http://localhost:3000", "http://127.0.0.1:3000", "http://[::1]:3000"]) {
    const boundRequest = new Request("http://0.0.0.0:3000/api/beta-signups", {
      method: "POST", headers: { "Content-Type": "application/json", origin }, body: JSON.stringify(payload),
    });
    assert.equal((await handleBetaSignup(boundRequest, { env: localEnvironment, store })).status, 200);
  }
  const otherPort = new Request("http://0.0.0.0:3000/api/beta-signups", {
    method: "POST", headers: { "Content-Type": "application/json", origin: "http://localhost:9999" }, body: JSON.stringify(payload),
  });
  assert.equal((await handleBetaSignup(otherPort, { env: localEnvironment, store })).status, 403);
});

test("production accepts configured canonical and Vercel preview origins, never reflected foreign hosts", async () => {
  const env = { NODE_ENV: "production", VERCEL: "1", SITE_URL: "https://www.8ntic.com", VERCEL_URL: "8ntic-review-123.vercel.app", BETA_RATE_LIMIT_SECRET: "x".repeat(32) };
  const store = { save: async () => ({ outcome: "received" as const }) };
  const send = (origin: string, url = "http://0.0.0.0:3000/api/beta-signups", host = "www.8ntic.com") => handleBetaSignup(new Request(url, {
    method: "POST", headers: { "Content-Type": "application/json", origin, host, "x-forwarded-host": host, "x-forwarded-for": "192.0.2.1" }, body: JSON.stringify(payload),
  }), { env, store });
  assert.equal((await send("https://www.8ntic.com")).status, 200);
  assert.equal((await send("https://8ntic-review-123.vercel.app")).status, 200);
  assert.equal((await send("https://foreign.example", "https://foreign.example/api/beta-signups", "foreign.example")).status, 403);
  assert.equal((await send("http://localhost:3000")).status, 403);
  assert.equal((await send("null")).status, 403);
  assert.equal((await send("https://unrelated-preview.vercel.app")).status, 403);
});
