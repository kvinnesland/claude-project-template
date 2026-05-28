# Minor Review Checklist

> For small, isolated fixes only (bug fixes, typos, single-function changes).
> Use `REVIEW-CHECKLIST.md` for features, architecture changes, or anything touching security or personal data.

## Traceability
- [ ] Minor CR exists and is approved
- [ ] Commit references the CR

## Correctness
- [ ] Fix addresses the stated problem
- [ ] No unintended side effects in adjacent code
- [ ] No regressions in existing tests

## Safety
- [ ] No new secrets, tokens, or credentials introduced
- [ ] No new external inputs without validation
- [ ] No changes to auth, access control, or data storage

## Tests
- [ ] Test covers the fixed case (unit or integration)
- [ ] All existing tests pass

---

```
MINOR REVIEW — YYYY-MM-DD — CR-XXX
Reviewer: [Name / handle]

PASSED: [items]
FAILED: [item — reason]

RECOMMENDATION: Approve | Request Changes
```
