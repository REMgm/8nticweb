import test from "node:test";
import assert from "node:assert/strict";
import { isBetaSignupAvailable } from "../lib/beta/availability.ts";

const configured = {
  NODE_ENV: "production", SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_test", BETA_RATE_LIMIT_SECRET: "x".repeat(32), VERCEL: "1",
};

test("production collection stays closed until every required configuration value is present", () => {
  assert.equal(isBetaSignupAvailable({ NODE_ENV: "production" }), false);
  for (const key of ["SUPABASE_URL", "SUPABASE_SECRET_KEY", "BETA_RATE_LIMIT_SECRET", "VERCEL"] as const) {
    assert.equal(isBetaSignupAvailable({ ...configured, [key]: "" }), false, key);
  }
  assert.equal(isBetaSignupAvailable(configured), true);
  assert.equal(isBetaSignupAvailable({ ...configured, VERCEL: undefined, BETA_TRUSTED_PROXY_HEADER: "x-real-ip" }), true);
});

test("invalid production configuration does not display a personal-data form", () => {
  for (const SUPABASE_URL of ["not a URL", "http://example.supabase.co", "https://user:password@example.supabase.co", "https://example.supabase.co/other", "https://example.supabase.co?query=1"]) {
    assert.equal(isBetaSignupAvailable({ ...configured, SUPABASE_URL }), false);
  }
  assert.equal(isBetaSignupAvailable({ ...configured, SUPABASE_SECRET_KEY: "  " }), false);
  assert.equal(isBetaSignupAvailable({ ...configured, BETA_RATE_LIMIT_SECRET: "short" }), false);
});

test("development keeps local SQLite available but rejects a partial remote configuration", () => {
  assert.equal(isBetaSignupAvailable({ NODE_ENV: "development" }), true);
  assert.equal(isBetaSignupAvailable({ NODE_ENV: "development", SUPABASE_URL: "https://example.supabase.co" }), false);
  assert.equal(isBetaSignupAvailable({ NODE_ENV: "development", SUPABASE_SECRET_KEY: "sb_secret_test" }), false);
  assert.equal(isBetaSignupAvailable({ NODE_ENV: "development", SUPABASE_URL: "http://localhost:54321", SUPABASE_SECRET_KEY: "sb_secret_test" }), true);
});
