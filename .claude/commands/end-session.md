# /end-session

Execute these steps at the end of every session.

## 1. Summarize Completed Work

List:
- Files created or modified
- CRs advanced or closed
- Specs updated
- Tests added
- Validations run

## 2. Update sessions/CURRENT-STATE.md

Update: phase, completed work, in-progress work, active CRs, blockers, next actions.

## 3. Append to sessions/IMPLEMENTATION-LEDGER.md

Add a row for each significant change:
| Date | Author | Session | Area | Changes | Related CR | Validation Status |

## 4. Update sessions/OPEN-ISSUES.md

- Close resolved issues
- Add new issues discovered
- Update priority/status where changed

## 5. Document Risks

List risks, tech debt, assumptions, and unresolved dependencies.

## 6. Archive Completed CRs

Move any CR with status `Done` or `Rejected` to `change-requests/archive/`.

```bash
mv change-requests/CR-XXX-*.md change-requests/archive/
```

This keeps `change-requests/` to active work only — reducing context loaded at next session start.
Archived CRs remain searchable and form the audit trail.

## 7. Document Next Actions

List recommended actions for next session in priority order. Be explicit.
