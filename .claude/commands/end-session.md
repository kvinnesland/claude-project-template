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

## 7. Trim Implementation Ledger

Move rows older than 90 days from `sessions/IMPLEMENTATION-LEDGER.md` to `sessions/IMPLEMENTATION-LEDGER-ARCHIVE.md`.

Steps:
1. Read `sessions/IMPLEMENTATION-LEDGER.md`
2. Identify rows where the Date column is more than 90 days before today
3. Append those rows to `sessions/IMPLEMENTATION-LEDGER-ARCHIVE.md` (create file with same header if it doesn't exist)
4. Remove those rows from `sessions/IMPLEMENTATION-LEDGER.md`

Keeps the active ledger small for context efficiency. Archive retains full history.

## 8. Document Next Actions

List recommended actions for next session in priority order. Be explicit.
