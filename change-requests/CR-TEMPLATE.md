# CR-XXX: [Title]

**Status:** Draft | In Review | Approved | In Progress | Done | Rejected
**Created:** YYYY-MM-DD

---

## Business Goal
## Problem Statement
## Proposed Solution

---

## Impact Analysis

### Affected Specs
- [ ] specs/vision.md
- [ ] specs/requirements.md
- [ ] specs/entities.md
- [ ] specs/flows.md
- [ ] specs/architecture.md
- [ ] specs/api.yaml
- [ ] specs/ui-spec.md
- [ ] specs/nfr.md

### Affected Components
### Database Impact
### API Impact
### UX Impact
### Security Impact and Threat Model

**Attack surface introduced:**
[What new entry points, inputs, or data flows does this CR add?]

**Trust boundaries crossed:**
[Does data cross user→API, API→DB, service→service, or external boundaries? How is it validated?]

**Threat actors:**
- [ ] Unauthenticated external user
- [ ] Authenticated user accessing other users' data
- [ ] Malicious input / injection
- [ ] Insider / compromised service

**OWASP Top 10 mapping:**
- [ ] A01 Broken Access Control — [relevant / not relevant: reason]
- [ ] A02 Cryptographic Failures — [relevant / not relevant: reason]
- [ ] A03 Injection — [relevant / not relevant: reason]
- [ ] A04 Insecure Design — [relevant / not relevant: reason]
- [ ] A05 Security Misconfiguration — [relevant / not relevant: reason]
- [ ] A06 Vulnerable Components — [relevant / not relevant: reason]
- [ ] A07 Authentication Failures — [relevant / not relevant: reason]
- [ ] A08 Software Integrity Failures — [relevant / not relevant: reason]
- [ ] A09 Logging Failures — [relevant / not relevant: reason]
- [ ] A10 SSRF — [relevant / not relevant: reason]

**New dependencies added:** [name@version — CVE check result]

**Security review required:** Yes (complete `reviews/SECURITY-REVIEW.md` before merge)
### Performance Impact

### GDPR Impact

**Involves personal data:** Yes / No
*(If No: verified by reviewing all new fields, logs, API responses, and third-party calls)*

**Personal data categories introduced or modified:**
- [Field name]: [Category — basic identity / contact / device / behavioral / financial / sensitive Art.9]

**Legal basis (Art. 6):** [basis — and Art. 9(2) exception if sensitive data]

**Data minimization:** [Why is each data point strictly necessary?]

**Retention period:** [Duration and deletion trigger]

**Deletion mechanism:** [How and when is data deleted?]

**Third-party processors receiving this data:** [Vendor — DPA status]

**Cross-border transfer outside EEA:** Yes / No — [if Yes: transfer mechanism]

**DPIA required:** Yes / No — [if Yes: link to gdpr/DPIA-CR-XXX.md]

**Data subject rights impact:**
- Access (Art. 15): [how supported]
- Erasure (Art. 17): [how supported]
- Portability (Art. 20): [how supported — if applicable]
- Rectification (Art. 16): [how supported]

**RoPA update required:** Yes / No

---

## Acceptance Criteria
- [ ]

## Required Tests
- [ ] Unit:
- [ ] Integration:
- [ ] E2E:

## Rollback Strategy
## Migration Strategy
## Risks
## Dependencies
## Validation Notes
