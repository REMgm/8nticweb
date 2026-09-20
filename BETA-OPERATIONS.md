# Beta signup implementation and operations

Implemented locally: accessible name/email form, versioned explicit opt-in, server validation, database-confirmed generic response, safe duplicates, durable rate counters, eligible-only CSV export. **No remote database has been provisioned or migrated. No welcome email or mailing workflow is implemented.** The existing Supabase project still needs its ownership and access confirmed before this migration is applied.

## Local development

Run the website with Node 25 and `npm run dev`. With neither Supabase environment value set, development uses Node's built-in SQLite at `.data/beta-signups.sqlite`. This is a real, durable local database; a completed request survives server restarts. It is not the production database and must not be treated as a centrally shared subscriber list. The form does not fake success. The web server uses this fixed path to keep production build file tracing confined to `.data`. Keep that directory and exports out of version control.

Run checks with `node --test tests/beta.test.ts`. Tests use temporary databases and remove them afterward. They do not write to Supabase or send mail.

The SQLite development adapter requires a Node release with `node:sqlite`, such as the local Node 25 runtime. Production always uses Supabase, including `npm start`; there is no production SQLite fallback. Missing or partial production configuration returns a retryable `503`, preserving entered form values.

## Production configuration

1. Confirm the 8NTIC-owned Supabase project, region, administrator access and backups. Apply `supabase/migrations/202609200001_beta_signups.sql` once to that project with an authorized administrator. This migration creates new dedicated tables and does not alter existing contacts.
2. Set server-only secrets on the deployment. Never use `NEXT_PUBLIC_` names:

   ```dotenv
   SUPABASE_URL=https://your-confirmed-project.supabase.co
   SUPABASE_SECRET_KEY=your-server-secret-key
   BETA_RATE_LIMIT_SECRET=a-cryptographically-random-secret-at-least-32-characters-long
   ```

   A current Supabase `sb_secret_...` key is sent using `apikey`. A legacy JWT service-role key is also supported using the same variable and an additional bearer header. Do not use an anonymous/publishable key. Generate the rate secret securely, store it in the hosting secret manager, and share it consistently across instances. No values belong in this document or git.
3. Vercel sets `VERCEL=1`; the endpoint then uses the platform-replaced `x-forwarded-for` client address. On another host, set `BETA_TRUSTED_PROXY_HEADER` only to a header that its trusted ingress strips and replaces. Requests without a trustworthy client address fail closed in production. Do not accept a directly client-controlled proxy header.
4. Submit designated test addresses on the deployed origin. Confirm persisted rows and the checks below. Remove test records afterward through authorized administration.

The backend uses the Supabase Data API with native server `fetch`; no browser database client or service key is shipped. The RPC function uses caller permissions, and only `service_role` has execution. Tables enable RLS, revoke public/anonymous/authenticated grants and expose no browser row policies. See official [Supabase database function guidance](https://supabase.com/docs/guides/database/functions) and [server API key guidance](https://supabase.com/docs/guides/getting-started/api-keys). Vercel's trusted forwarding behavior is described in [request headers](https://vercel.com/docs/headers/request-headers).

## Submission contract

`POST /api/beta-signups` accepts JSON, with a maximum encoded body of 4 KiB:

```json
{
  "name": "Avery Example",
  "email": "avery@example.com",
  "consent": true,
  "consentVersion": "beta-research-updates-v1",
  "website": ""
}
```

The checkbox is unchecked initially and explicitly asks: “Email me about 8NTIC beta news and research updates.” The server rejects old/unknown consent versions. A honeypot rejection returns `400`, never an invented saved response. Unknown properties are rejected. Names retain their spelling, and email normalization only trims and lowercases; dots and plus tags remain intact.

The database RPC increments fixed-window counters and inserts within one transaction. Limits are five valid submission attempts per IP per ten-minute window and three per normalized address per hour. Identifiers are daily keyed hashes, not raw IP addresses or emails. Expired counters are deleted on subsequent requests. Fixed-window boundaries can allow a short burst on either side of a boundary; deployment edge rate controls may supplement this for high traffic. Invalid input is rejected before invoking database persistence. Limits apply across production server instances because the counters live in PostgreSQL.

| HTTP status | Meaning |
| --- | --- |
| `200` | Database confirmed a committed insert or an existing duplicate. Identical generic body in both cases. |
| `400` | Invalid fields, missing explicit permission, old wording, malformed JSON or triggered honeypot. |
| `403` | A supplied Origin differs from this website's request origin. |
| `413` | Body exceeds 4 KiB, including streamed bodies without Content-Length. |
| `415` | Content-Type is not JSON. |
| `429` | Shared limiter rejected the attempt, with a `Retry-After` header. |
| `503` | Missing configuration, inaccessible database, RPC error, timeout or unconfirmed database response. |

No subscriber ID, row count or existing status is exposed. A duplicate does not change the original name, consent, timestamps or preference. An unsubscribed/suppressed address remains so. Repeating a timed-out request is safe. A supplied address remains unverified; list membership does not grant beta access. Email addresses and consent evidence never enter QIP memory or model training.

## Authorized review, export and preference changes

Use the Supabase project's authorized administrative interface to review records. There is no public admin/export route. Export only eligible rows using the same server environment:

```sh
node --env-file=.env.local scripts/export-beta.ts --output .data/beta-eligible.csv
```

In development without Supabase credentials, the command exports from the local database. It creates a private CSV, refuses to overwrite an existing file, and escapes formula prefixes for spreadsheet use. Keep exports in controlled storage. An export is a snapshot, so **recheck current status before any send**. For an active changing list, implement sending directly against current database preferences rather than treating an old CSV as authorization.

Assign an owner and real contact route for withdrawal/deletion requests before launch. An authorized administrator can change an eligible record to `unsubscribed` and set `unsubscribed_at`; suppression requires `status='suppressed'`, `suppressed_at` and one controlled `suppression_reason`. Database constraints enforce state consistency. Do not silently reactivate an address, clear suppression, or copy contacts into this list.

Before sending any email, add a verified-owner preference workflow with opaque scoped tokens. A link GET displays a confirmation, and a POST commits withdrawal. Include working unsubscribe links in each message and synchronize provider suppressions. No such email sending or token flow is claimed in the current build. Agree a retention/deletion policy, mailbox verification strategy and backup checks with the data owner.

## Remote acceptance checks still required

- Verify a real signup persists before the browser shows received.
- Verify simultaneous case/whitespace duplicates produce one record and preserve withdrawn/suppressed records.
- Verify anonymous and normal authenticated keys cannot read, insert, update or execute the RPC; verify the configured server secret can.
- Verify cross-instance limits and `Retry-After` against the actual deployed database.
- Verify database outage, timeout and missing configuration never yield success.
- Verify exports exclude withdrawn/suppressed addresses and remain private.

The local test suite checks validation, persistence across connections, preserved withdrawal, durable rate counters, deferred success, API error boundaries and RPC confirmation. It cannot establish production RLS behavior or remote connectivity before the migration is deployed.

[QIP_CAPTURE]
type: implementation_decision
tier: L2-mid
status: implemented_locally_remote_configuration_pending
decision: Beta signup is a separate communication-preference list with explicit versioned permission. Local development uses durable SQLite; production requires a confirmed Supabase transaction and shared database rate limits. Duplicate submissions preserve withdrawal and suppression.
boundary: This architecture record contains no subscriber data and has not been written to an external memory store. No remote migration or email send has occurred.
[/QIP_CAPTURE]
