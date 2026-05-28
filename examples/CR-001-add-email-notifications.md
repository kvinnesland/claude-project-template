# CR-001: Add email notification on account creation

**Status:** Done
**Created:** 2026-01-15
**Author:** ada
**Approved by:** ada
**Approved date:** 2026-01-15

---

## Business Goal
New users should receive a welcome email immediately after registering, to confirm their address and improve activation rates.

## Problem Statement
Currently no email is sent after registration. Support receives tickets from users unsure whether their account was created successfully.

## Proposed Solution
Send a transactional welcome email via SendGrid after a user record is successfully created. Email contains: name, confirmation link (24h expiry), and support link.

---

## Impact Analysis

### Affected Specs
- [x] specs/flows.md — add "Send welcome email" step to registration flow
- [x] specs/entities.md — add `email_verified` field to User
- [x] specs/nfr.md — document email delivery SLA (< 30s p95)
- [ ] specs/api.yaml — no new endpoints
- [ ] specs/ui-spec.md — no frontend changes

### Affected Components
- `services/UserService.ts` — triggers email after user creation
- `services/EmailService.ts` — new service, wraps SendGrid SDK
- `jobs/SendWelcomeEmail.ts` — async job (BullMQ)

### Database Impact
New column: `users.email_verified BOOLEAN DEFAULT false`
Migration: `migrations/0003_add_email_verified.sql`

### API Impact
None — internal trigger only.

### UX Impact
None visible — email delivered asynchronously.

### Security Impact and Threat Model

**Attack surface introduced:**
- SendGrid API key in environment — must not be logged or exposed
- Confirmation link token — must be signed and short-lived

**Trust boundaries crossed:**
- API → SendGrid (external): email content and recipient address

**Threat actors:**
- [x] Unauthenticated external user — registration endpoint is public; rate-limited at API gateway
- [x] Malicious input / injection — email address validated with zod before use

**OWASP Top 10 mapping:**
- [x] A01 Broken Access Control — not relevant: no access gating on this flow
- [x] A02 Cryptographic Failures — relevant: confirmation token uses HMAC-SHA256, 24h TTL
- [x] A03 Injection — relevant: email content built from trusted template, no user input interpolated
- [x] A04 Insecure Design — not relevant
- [x] A05 Security Misconfiguration — relevant: SendGrid key in env var, documented in `specs/nfr.md`
- [x] A06 Vulnerable Components — relevant: `@sendgrid/mail@8.1.0` — npm audit clean
- [x] A07 Authentication Failures — not relevant
- [x] A08 Software Integrity Failures — not relevant
- [x] A09 Logging Failures — relevant: email address masked in logs (`a***@domain.com`)
- [x] A10 SSRF — not relevant: no user-supplied URLs

**New dependencies added:** `@sendgrid/mail@8.1.0` — npm audit: 0 vulnerabilities

**Security review required:** Yes — completed in `reviews/SECURITY-REVIEW-CR-001.md`

### Performance Impact
Email sent via async BullMQ job — registration response time unaffected. SendGrid p95 < 30s per SLA.

### GDPR Impact

**Involves personal data:** Yes

**Personal data categories introduced or modified:**
- `email`: contact data
- `name`: basic identity (existing field, now included in email)
- `email_verified`: account status (non-PII)

**Legal basis (Art. 6):** 6(1)(b) — performance of contract (account creation)

**Data minimization:** Only name and email sent — minimum required for transactional message.

**Retention period:** Email logs in SendGrid: 30 days (configured in SendGrid account settings). Confirmation token: deleted on use or expiry.

**Deletion mechanism:** On account deletion, SendGrid contact suppressed via API. Token row deleted by nightly job.

**Third-party processors receiving this data:** SendGrid (Twilio) — DPA signed 2026-01-10, noted in `gdpr/processors.md`

**Cross-border transfer outside EEA:** Yes — SendGrid US servers. Transfer mechanism: Standard Contractual Clauses (SCCs).

**DPIA required:** No — not high-risk processing, no Art. 35 triggers.

**Data subject rights impact:**
- Access (Art. 15): email address already accessible in account settings
- Erasure (Art. 17): account deletion suppresses SendGrid contact
- Portability (Art. 20): not applicable (transactional, not stored)
- Rectification (Art. 16): email update propagates to future sends

**RoPA update required:** Yes — added "Transactional email" activity to `gdpr/RoPA.md`

---

## Acceptance Criteria
- [ ] Welcome email sent within 30s of successful registration (p95)
- [ ] Email contains user's name, confirmation link, support link
- [ ] Confirmation link expires after 24h
- [ ] `email_verified` set to `true` on confirmation
- [ ] Failed sends retried 3x with exponential backoff
- [ ] Email address masked in all logs

## Required Tests
- [ ] Unit: `EmailService.sendWelcome()` — mocked SendGrid client
- [ ] Unit: confirmation token generation and verification
- [ ] Integration: registration → job enqueued → email sent (test SendGrid sandbox)
- [ ] E2E: registration → inbox → confirmation link → `email_verified: true`

## Rollback Strategy
1. Revert `services/EmailService.ts` and `jobs/SendWelcomeEmail.ts`
2. Remove `email_verified` column: `migrations/0003_rollback.sql`
3. Remove SendGrid dependency: `npm remove @sendgrid/mail`
4. Remove `SENDGRID_API_KEY` from environment secrets

## Migration Strategy
`migrations/0003_add_email_verified.sql` — backwards compatible (nullable column, default false). Run before deploy.

## Risks
- SendGrid outage → emails queued, delivered when service recovers. Acceptable.
- Confirmation link phishing — mitigated by HMAC signature and 24h TTL.

## Dependencies
- CR-000: User registration flow (Done)
- SendGrid account and DPA in place (confirmed 2026-01-10)

## Validation Notes
All CI checks passed. Security review passed. GDPR review passed.
