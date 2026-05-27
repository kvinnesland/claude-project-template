# RELEASE-CHECKLIST.md

> Run via `/release` before every release.
> Every item must be PASSED, FAILED, or WAIVED (with written reason).
> A single FAILED on CR Status, Validation, Security, or Deployment Spec = block release.

---

## 1. Change Completeness

- [ ] All CRs planned for this release have Status: Done
- [ ] No CRs are In Progress or Approved (unfinished work not included in release)
- [ ] IMPLEMENTATION-LEDGER.md updated with all changes in this release
- [ ] CURRENT-STATE.md reflects current phase and branch

---

## 2. Validation Suite

- [ ] `npm run validate` passes with no FAILED checks
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No regressions in existing test coverage

---

## 3. Security

- [ ] `/security-report` run — no CRITICAL or HIGH gaps unresolved
- [ ] Secret scanning passed (TruffleHog in CI)
- [ ] `npm audit --audit-level=high` passes
- [ ] All endpoints have documented auth requirements in `specs/api.yaml`
- [ ] No hardcoded secrets in codebase

---

## 4. GDPR

- [ ] `/gdpr-report` run — no CRITICAL gaps unresolved
- [ ] `gdpr/RoPA.md` reflects all processing activities in this release
- [ ] All new third-party processors have confirmed DPA in `gdpr/processors.md`
- [ ] All triggered DPIAs are reviewed and signed off
- [ ] Data subject rights implementable for all personal data introduced

---

## 5. Deployment Readiness

- [ ] `specs/deployment.md` is fully populated (not template placeholders)
- [ ] All required environment variables documented in `specs/deployment.md`
- [ ] Database migrations tested on a copy of production data (or staging equivalent)
- [ ] Migrations are reversible — rollback procedure documented
- [ ] Health check endpoint verified in staging
- [ ] Staging deploy succeeded and was manually verified

---

## 6. Rollback Plan

- [ ] Rollback procedure documented in `specs/deployment.md`
- [ ] Rollback decision owner identified
- [ ] Previous version is deployable (previous tag exists and is known good)
- [ ] Database rollback tested if migrations are included

---

## 7. CHANGELOG

- [ ] `CHANGELOG.md` updated with all CRs in this release
- [ ] Version number follows SemVer: breaking = major, new feature = minor, fix = patch
- [ ] Release date is today's date

---

## 8. Communication (if applicable)

- [ ] Stakeholders notified of release
- [ ] Breaking changes communicated to consumers of the API
- [ ] Privacy notice updated if new personal data processing introduced

---

## Output

```
RELEASE CHECKLIST — vX.Y.Z — YYYY-MM-DD
Release owner: [Name / handle]

PASSED:
- [item]

FAILED:
- [item] — [reason and blocker]

WAIVED:
- [item] — [reason]

RECOMMENDATION: Proceed / Block
```

A FAILED on sections 1, 2, 3, 4, or 5 = Block.
