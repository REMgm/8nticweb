import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { CONSENT_SCOPE, SIGNUP_SOURCE } from "./validation.ts";
import type { BetaStore, SaveResult } from "./store.ts";

// Development only. Production always uses the shared PostgreSQL transaction.
export function createLocalStore(path: string, now: () => number = Date.now): BetaStore {
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  return {
    async save(signup, keys): Promise<SaveResult> {
      const db = new DatabaseSync(path);
      try {
        db.exec(`PRAGMA busy_timeout = 5000;
          CREATE TABLE IF NOT EXISTS beta_signups (
            id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
            email_normalized TEXT NOT NULL UNIQUE,
            status TEXT NOT NULL DEFAULT 'eligible' CHECK(status IN ('eligible','unsubscribed','suppressed')),
            consent_scope TEXT NOT NULL, consent_version TEXT NOT NULL, consent_at TEXT NOT NULL,
            source TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
            unsubscribed_at TEXT, suppressed_at TEXT, suppression_reason TEXT, email_verified_at TEXT,
            CHECK ((status = 'unsubscribed') = (unsubscribed_at IS NOT NULL)),
            CHECK ((status = 'suppressed') = (suppressed_at IS NOT NULL)),
            CHECK (suppression_reason IS NULL OR suppression_reason IN ('complaint','hard_bounce','do_not_contact')),
            CHECK ((status = 'suppressed') = (suppression_reason IS NOT NULL))
          );
          CREATE TABLE IF NOT EXISTS beta_rate_limits (
            key TEXT NOT NULL, window_start INTEGER NOT NULL, attempts INTEGER NOT NULL,
            expires_at INTEGER NOT NULL, PRIMARY KEY(key, window_start)
          );
          BEGIN IMMEDIATE;`);
        const seconds = Math.floor(now() / 1000);
        const stamp = new Date(seconds * 1000).toISOString();
        db.prepare("DELETE FROM beta_rate_limits WHERE expires_at <= ?").run(seconds);
        let retryAfter = 0;
        for (const limit of [{ key: keys.ipKey, period: 600, maximum: 5 }, { key: keys.emailKey, period: 3600, maximum: 3 }]) {
          const start = Math.floor(seconds / limit.period) * limit.period;
          const row = db.prepare(`INSERT INTO beta_rate_limits(key, window_start, attempts, expires_at)
            VALUES (?, ?, 1, ?) ON CONFLICT(key, window_start) DO UPDATE SET attempts = min(attempts + 1, 100000)
            RETURNING attempts`).get(limit.key, start, start + limit.period) as { attempts: number };
          if (row.attempts > limit.maximum) retryAfter = Math.max(retryAfter, start + limit.period - seconds);
        }
        if (retryAfter > 0) {
          db.exec("COMMIT");
          return { outcome: "rate_limited", retryAfter };
        }
        db.prepare(`INSERT INTO beta_signups
          (id, name, email, email_normalized, status, consent_scope, consent_version, consent_at, source, created_at, updated_at)
          VALUES (?, ?, ?, ?, 'eligible', ?, ?, ?, ?, ?, ?) ON CONFLICT(email_normalized) DO NOTHING`)
          .run(randomUUID(), signup.name, signup.email, signup.email.toLowerCase(), CONSENT_SCOPE,
            signup.consentVersion, stamp, SIGNUP_SOURCE, stamp, stamp);
        db.exec("COMMIT");
        return { outcome: "received" };
      } catch (error) {
        try { db.exec("ROLLBACK"); } catch { /* No active transaction. */ }
        throw error;
      } finally {
        db.close();
      }
    },
  };
}
