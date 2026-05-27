# REVIEW-CHECKLIST.md

> **Single source of truth for reviews.** The `/review` command runs this checklist.
> Every item must be marked PASSED, FAILED, or WAIVED (with written reason).

## Traceability
- [ ] Change covered by approved CR
- [ ] Specs updated before code
- [ ] Commits reference CR

## Spec Alignment
- [ ] Implementation matches specs — no undocumented behavior
- [ ] No new entities or API fields introduced outside specs

## Architecture
- [ ] Module boundaries respected
- [ ] No forbidden imports
- [ ] No circular dependencies
- [ ] Layering rules followed (API → Service → Repository)

## Type Safety
- [ ] No untyped inputs or outputs
- [ ] No `any` without justification

## Testing
- [ ] Unit tests for all new logic
- [ ] Integration tests for all new endpoints
- [ ] Edge cases covered
- [ ] All existing tests pass

## Security
- [ ] Threat Model completed in CR and reviewed by human
- [ ] `reviews/SECURITY-REVIEW.md` completed and passed
- [ ] All new endpoints require auth (unless explicitly public in `specs/api.yaml`)
- [ ] All inputs validated at trust boundaries
- [ ] No hardcoded secrets, tokens, or API keys
- [ ] No sensitive data or PII in logs
- [ ] No dangerous patterns (`eval`, `dangerouslySetInnerHTML`, raw SQL interpolation)
- [ ] New dependencies have documented CVE check in CR
- [ ] Secret scanning passed in CI

## Performance
- [ ] No N+1 queries
- [ ] NFR targets not violated

## Observability
- [ ] Structured logging for new flows
- [ ] Errors logged with context

## Maintainability
- [ ] Code is readable
- [ ] Functions have single responsibilities

## UX (if applicable)
- [ ] Matches `specs/ui-spec.md`
- [ ] Design tokens used
- [ ] Loading, error, and empty states handled
- [ ] Accessible markup (WCAG 2.1 AA minimum)

## Frontend Localization (if frontend changes)
- [ ] Date/time format authorized in CR and documented in `specs/ui-spec.md`
- [ ] All dates rendered through shared formatting utility — no inline format strings
- [ ] User-facing date format setting exists (or is in scope of this CR)
- [ ] Units authorized (Metric / Imperial) in CR and documented in `specs/ui-spec.md`
- [ ] All units rendered through shared conversion utility — no inline unit labels
- [ ] User-facing unit system setting exists (or is in scope of this CR)
- [ ] Language strategy authorized in CR and documented in `specs/ui-spec.md`
- [ ] All visible strings externalized through i18n utility — no raw literals in components
- [ ] User-facing language setting exists if multi-language authorized
