# Rule: Security

> Security is not a review step — it is a design constraint.
> These rules apply to every CR, regardless of size or scope.

---

## Shift-Left: Security Before Code

Security analysis happens at CR time, not review time.

Every CR must include a completed Threat Model section before it can be approved.
Claude MUST NOT begin implementation until the threat model is reviewed by the human.

---

## Security Review Is Always Required

`reviews/SECURITY-REVIEW.md` must be completed for every CR.
It is NOT optional for "small" changes — all changes introduce attack surface.

---

## OWASP Top 10 — Mandatory Mapping

Every CR must map relevant threats to the OWASP Top 10 (2021):

| ID | Category |
|---|---|
| A01 | Broken Access Control |
| A02 | Cryptographic Failures |
| A03 | Injection |
| A04 | Insecure Design |
| A05 | Security Misconfiguration |
| A06 | Vulnerable and Outdated Components |
| A07 | Identification and Authentication Failures |
| A08 | Software and Data Integrity Failures |
| A09 | Security Logging and Monitoring Failures |
| A10 | Server-Side Request Forgery (SSRF) |

If a category is not relevant, state explicitly why.

---

## Trust Boundaries

Every CR that crosses a trust boundary requires explicit documentation of:
- What data crosses the boundary
- How it is validated on the receiving side
- What the failure mode is if validation fails

Trust boundaries include:
- User input → application
- Application → database
- Application → external service
- Service → service (internal)
- Frontend → backend API

---

## Secrets

- Secrets MUST NEVER appear in source code, commit messages, or logs
- All secrets must be injected via environment variables
- `.env` files must be listed in `.gitignore`
- Secret patterns are checked automatically in CI — a failing secret scan blocks merge

---

## Dependencies

- Every new dependency must be checked for known CVEs before the CR is approved
- `npm audit` (or equivalent) runs in CI and blocks merge on high/critical vulnerabilities
- The dependency, its version, and CVE check result must be documented in the CR

---

## Forbidden

Claude MUST NEVER:
- Implement auth, authorization, or data access changes without a completed threat model
- Add a dependency without documenting its CVE status in the CR
- Hardcode secrets, tokens, API keys, or passwords
- Use `eval()`, `dangerouslySetInnerHTML`, raw SQL string interpolation, or equivalent without explicit security justification in the CR
- Log PII, tokens, or sensitive fields
- Return stack traces, internal paths, or system details to clients
- Approve its own security review — human sign-off required for all security decisions
