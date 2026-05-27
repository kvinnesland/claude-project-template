# /security-report

Produce a consolidated security posture report by reading all relevant files.
Use this for internal oversight, pre-release security review, or documentation to stakeholders.

Works at any stage — useful from first CR onwards.

---

## 1. Read All Security-Relevant Sources

Read in this order:

1. `rules/security/RULE.md` — security governance rules
2. `reviews/SECURITY-REVIEW.md` — review checklist template
3. `sessions/ARCHITECTURE-STATE.md` — current architecture and external dependencies
4. `specs/architecture.md` — module boundaries and forbidden imports
5. `specs/api.yaml` — all API endpoints (auth requirements, input surfaces)
6. `specs/entities.md` — data model (PII fields, sensitive data)
7. `specs/nfr.md` — security NFRs (encryption, auth standards)
8. All files in `change-requests/` — Threat Model and Security Impact sections
9. `validation/security-validation.ts` — what automated checks are in place
10. `.github/workflows/validate.yml` — CI security jobs (secret scanning, audit)

If a file is missing or still contains template placeholders, note it as a gap.

---

## 2. Produce the Report

Output the report in the structure below.
Be factual — flag gaps explicitly. Do not assess legal correctness.

---

```
# Security Posture Report
Generated: [today's date]
Project: [from specs/vision.md]

---

## 1. Executive Summary

[2–4 sentences: overall security posture, number of CRs with completed threat
models, any critical gaps requiring immediate action before go-live]

---

## 2. Threat Model Coverage

Source: change-requests/CR-*.md (Security Impact and Threat Model sections)

| CR | Title | Threat model complete | OWASP mapped | Human sign-off |
|---|---|---|---|---|
| CR-XXX | [title] | Yes / No / Partial | Yes / No | Yes / No |

Summary:
- [N] of [N] CRs have completed threat models
- [N] of [N] CRs have full OWASP Top 10 mapping

Gaps:
- [Any CR missing threat model or OWASP mapping]

---

## 3. OWASP Top 10 — Cross-CR Summary

For each category, list which CRs assessed it as relevant and what mitigations are documented.

| ID | Category | Relevant in CRs | Mitigations documented |
|---|---|---|---|
| A01 | Broken Access Control | CR-XXX, CR-YYY | [summary or —] |
| A02 | Cryptographic Failures | — | — |
| A03 | Injection | CR-XXX | [summary or —] |
| A04 | Insecure Design | — | — |
| A05 | Security Misconfiguration | — | — |
| A06 | Vulnerable Components | CR-XXX | [summary or —] |
| A07 | Authentication Failures | — | — |
| A08 | Software Integrity Failures | — | — |
| A09 | Logging Failures | — | — |
| A10 | SSRF | — | — |

Gaps:
- [Any category that appears in an endpoint or data flow but was not assessed]

---

## 4. Authentication and Authorization

Source: specs/api.yaml, change-requests/

| Concern | Status | Notes |
|---|---|---|
| All endpoints require auth unless explicitly public | Defined / Not defined / Partial | [which endpoints are public and why] |
| Token validation server-side | Defined / Not defined | [mechanism or gap] |
| Token expiry enforced | Defined / Not defined | [TTL or gap] |
| RBAC enforced at service layer | Defined / Not defined | [approach or gap] |
| Horizontal privilege escalation blocked | Defined / Not defined | [how or gap] |

---

## 5. Input Validation and Injection

Source: specs/api.yaml, change-requests/

| Concern | Status | Notes |
|---|---|---|
| All external inputs validated at boundary | Defined / Not defined | [schema validation approach or gap] |
| No raw SQL interpolation | Enforced / Not enforced | [ORM/parameterized queries or gap] |
| File upload restrictions | Defined / Not defined / N/A | [type, size, storage or gap] |
| No eval / dangerouslySetInnerHTML / innerHTML | Enforced / Not enforced | [mechanism or gap] |

---

## 6. Secrets and Configuration

Source: .gitignore, validation/security-validation.ts, CI pipeline

| Concern | Status | Notes |
|---|---|---|
| .env files gitignored | Yes / No | |
| No .env files committed | Verified / Not verified | [CI check or manual] |
| Secret scanning in CI | Active / Not active | [TruffleHog or gap] |
| Secrets injected via environment variables | Defined / Not defined | [approach or gap] |

---

## 7. Dependencies

Source: change-requests/ (Dependencies sections), package.json if present

| Dependency | Version | CVE check | Documented in CR | Notes |
|---|---|---|---|---|
| [name] | [version] | Clean / [CVE-ID] | Yes / No | |

Gaps:
- [Any dependency added without CVE check in CR]
- [Any dependency with known vulnerabilities]

---

## 8. Cryptography

Source: specs/nfr.md, change-requests/

| Concern | Status | Notes |
|---|---|---|
| Password hashing algorithm | Defined / Not defined | [bcrypt/argon2 or gap] |
| Token generation (cryptographically secure) | Defined / Not defined | [approach or gap] |
| Sensitive data encrypted at rest | Defined / Not defined | [standard or gap] |
| TLS enforced on all external communication | Defined / Not defined | [version or gap] |

---

## 9. Security Logging and Monitoring

Source: specs/nfr.md, change-requests/

| Concern | Status | Notes |
|---|---|---|
| Auth failures logged | Defined / Not defined | |
| Privileged actions logged with actor | Defined / Not defined | |
| No PII / tokens / passwords in logs | Enforced / Not enforced | [mechanism or gap] |
| Structured logging for security events | Defined / Not defined | |

---

## 10. Automated Security Controls

Source: validation/security-validation.ts, .github/workflows/validate.yml

| Control | In place | Notes |
|---|---|---|
| Hardcoded secret pattern scanning | Yes / No | [validation script check] |
| Dangerous code pattern scanning | Yes / No | [eval, innerHTML, raw SQL] |
| TruffleHog secret scanning in CI | Yes / No | [CI job] |
| npm audit in CI | Yes / No | [audit level] |
| Threat model presence check in CI | Yes / No | [validation script check] |

---

## 11. Security Gaps — Prioritized

[All gaps found above, ranked by risk:]

CRITICAL (fix before any user data or go-live):
- [ ] [gap] — [file to update or CR to create]

HIGH (fix before production):
- [ ] [gap] — [file to update or CR to create]

MEDIUM (fix before scale):
- [ ] [gap] — [file to update or CR to create]

LOW (hygiene):
- [ ] [gap] — [file to update or CR to create]

---

## 12. Recommended Next Actions

[Concrete, numbered actions referencing specific files or CRs:]

1. [Action] → update [file] / create [CR]
2. ...

---

## Sources Read

- rules/security/RULE.md — [present / missing]
- specs/api.yaml — [N endpoints / empty template]
- specs/entities.md — [N entities, N PII fields]
- change-requests/ — [N CRs with Threat Model sections]
- .github/workflows/validate.yml — [security jobs active / missing]
```

---

## 3. Save the Report (Optional)

If the user wants to save the report:

Save output to `reviews/SECURITY-REPORT-[YYYY-MM-DD].md`.
Do not commit automatically — let the user review and commit when ready.
