# /create-cr

Execute these steps to create a new Change Request.

> If the problem space is unclear or the domain model is involved, consider running `/interview-and-define` first.

## 0. Determine CR Type

Ask: "Is this a minor fix (isolated bug fix, typo, small config change) or a feature/change (new behaviour, architecture, data model, security, GDPR)?"

- **Minor fix** → use `change-requests/CR-MINOR-TEMPLATE.md` and skip to Step 3
- **Feature / change** → continue with Steps 1–3 below

## 1. Gather Information (feature/change only)

Ask:
1. Business goal — what problem does this solve?
2. Proposed solution — high-level, what changes?
3. Which specs are affected?
4. Is this a breaking change?

## 2. Perform Impact Analysis (feature/change only)

Analyze and document:
- Affected modules
- Specs that must update before code
- Database impact
- API impact
- UX impact
- Security impact (threat model required — see CR-TEMPLATE.md)
- GDPR impact (if `GDPR Applicable: true` in CURRENT-STATE.md)
- Performance impact
- Required tests

## 3. Create CR File

Assign the next available CR number.

- Minor fix → create `change-requests/CR-XXX-short-title.md` from `change-requests/CR-MINOR-TEMPLATE.md`
- Feature → create `change-requests/CR-XXX-short-title.md` from `change-requests/CR-TEMPLATE.md`

Fill in all sections — no section may be left blank.

See `examples/CR-001-add-email-notifications.md` for a complete filled-in example.
