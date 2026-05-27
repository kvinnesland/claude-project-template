# /create-cr

Execute these steps to create a new Change Request.

> If the problem space is unclear or the domain model is involved, consider running `/interview-and-define` first.

## 1. Gather Information

Ask:
1. Business goal — what problem does this solve?
2. Proposed solution — high-level, what changes?
3. Which specs are affected?
4. Is this a breaking change?

## 2. Perform Impact Analysis

Analyze and document:
- Affected modules
- Specs that must update before code
- Database impact
- API impact
- UX impact
- Security impact
- Performance impact
- Required tests

## 3. Create CR File

Create `/change-requests/CR-XXX-short-title.md` by copying `change-requests/CR-TEMPLATE.md`.
Assign the next available CR number. Fill in all sections — no section may be left blank.

The template is the single source of truth: `change-requests/CR-TEMPLATE.md`.
