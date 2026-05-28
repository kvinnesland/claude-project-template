# CR-XXX: [Title]

**Status:** Draft | In Review | Approved | In Progress | Done | Rejected
**Created:** YYYY-MM-DD
**Author:** [Name / handle]
**Approved by:** [Name / handle] | self
**Approved date:** YYYY-MM-DD | —

---

## Business Goal
[Why does this matter? What user or business problem does it solve?]

## Proposed Solution
[What will be built? High-level — not implementation details.]

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
[Which modules, pages, services, or jobs are touched?]

### Security Impact
[Brief assessment. If low risk: state why — e.g. "Read-only, no new endpoints, no auth changes."]

> **Include a full Threat Model if any of these apply:**
> new API endpoints · auth or access control changes · file uploads · external integrations · payment handling · user-generated content
>
> Full Threat Model format:
> - Attack surface introduced
> - Trust boundaries crossed
> - Threat actors (unauthenticated user / authenticated user accessing others' data / malicious input / insider)
> - OWASP Top 10 mapping (A01–A10) — mark each relevant/not relevant with reason
> - New dependencies: name@version — CVE check result
> - Security review required: Yes → complete `reviews/SECURITY-REVIEW.md` before merge

### GDPR Impact
[If `GDPR Applicable: false` in CURRENT-STATE.md, write: "N/A — GDPR not applicable to this project."]
[If applicable and no personal data: state "No personal data introduced or modified — verified by reviewing new fields, logs, API responses, and third-party calls."]

> **Include a full GDPR section if personal data is introduced, modified, or removed:**
> - Personal data categories and fields
> - Legal basis (Art. 6) — and Art. 9(2) if sensitive data
> - Data minimization rationale
> - Retention period and deletion trigger
> - Deletion mechanism
> - Third-party processors receiving data and DPA status
> - Cross-border transfer outside EEA and transfer mechanism
> - DPIA required: Yes/No — link to gdpr/DPIA-CR-XXX.md if yes
> - Data subject rights: access / erasure / portability / rectification
> - RoPA update required: Yes/No
> - Complete `reviews/GDPR-REVIEW.md` before merge

### Performance Impact
[Expected impact on response time, query count, or resource use. "None" is a valid answer if justified.]

### Database Impact
[New tables, columns, indexes, or migrations. "None" if no schema changes.]

### API Impact
[New or modified endpoints. "None" if no API changes.]

---

## Acceptance Criteria
- [ ]

## Required Tests
- [ ] Unit:
- [ ] Integration:
- [ ] E2E:

## Rollback Strategy
[How to revert — e.g. revert commits, run rollback migration, disable feature flag.]

## Dependencies
[Other CRs or external work that must be done first. "None" if independent.]
