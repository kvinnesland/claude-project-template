# SECURITY-REVIEW.md

> **Required for every CR before merge — not only for auth/integration changes.**
> Every change introduces potential attack surface.
> Mark each item: PASS / FAIL / N/A (with written reason).

---

## Threat Model Verification

- [ ] CR contains a completed Threat Model section
- [ ] All relevant OWASP Top 10 categories addressed (relevant or explicitly ruled out)
- [ ] Trust boundaries identified and validated
- [ ] Threat model reviewed and signed off by human

---

## Authentication

- [ ] All new endpoints require authentication unless explicitly marked public in `specs/api.yaml`
- [ ] Token validation happens server-side
- [ ] Token expiry enforced
- [ ] No authentication logic in frontend only

---

## Authorization

- [ ] Role-based access enforced at the service layer (never only at API layer)
- [ ] Users cannot access or modify other users' data (horizontal privilege escalation checked)
- [ ] Privilege escalation paths considered and blocked

---

## Input Validation

- [ ] All external inputs validated against a schema at the boundary
- [ ] No raw SQL string interpolation — parameterized queries or ORM only
- [ ] File uploads restricted by type, size, and stored outside webroot
- [ ] No `eval()`, `dangerouslySetInnerHTML`, or `innerHTML =` without explicit justification

---

## Data Exposure

- [ ] API responses contain only fields listed in `specs/api.yaml` — no over-fetching
- [ ] Error messages do not expose stack traces, internal paths, or system details to clients
- [ ] Sensitive fields (passwords, tokens, PII) never returned in responses
- [ ] PII and tokens never written to logs

---

## Secrets and Configuration

- [ ] No hardcoded secrets, tokens, API keys, or passwords in source code
- [ ] All secrets injected via environment variables
- [ ] `.env` files listed in `.gitignore`
- [ ] Secret scanning passed in CI

---

## Dependencies

- [ ] All new dependencies documented in CR with version and CVE check result
- [ ] `npm audit` (or equivalent) passes with no high/critical vulnerabilities
- [ ] Dependency added for a clear, scoped reason — not as convenience

---

## Cryptography

- [ ] Passwords hashed with bcrypt, argon2, or equivalent — never MD5/SHA1
- [ ] Tokens generated with cryptographically secure random source
- [ ] Sensitive data encrypted at rest if required by spec
- [ ] TLS enforced on all external communication

---

## Security Logging and Monitoring

- [ ] Auth failures logged (without sensitive data)
- [ ] Privileged actions logged with actor identity
- [ ] No sensitive data (PII, tokens, passwords) in log output

---

## SSRF and External Calls

- [ ] All outbound HTTP calls use an allowlist of destinations if user-controlled input is involved
- [ ] Redirects do not expose internal services

---

## Output

```
SECURITY REVIEW — [Date] — CR-XXX

PASS:
- [item]

FAIL:
- [item] — [reason and remediation required]

N/A:
- [item] — [reason]

RECOMMENDATION: Approve | Request Changes | Reject
Reviewed by: human | Claude (human sign-off required for Approve)
```

A single FAIL without accepted remediation plan = Request Changes.
A FAIL on Authentication, Authorization, Secrets, or Threat Model = Reject.
