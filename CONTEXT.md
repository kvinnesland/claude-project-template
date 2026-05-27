# CONTEXT.md — Project Domain Context

> Created by `/interview-and-define`. Updated whenever domain language evolves.
> Claude reads this at session startup if present.

---

## Product Summary

**Product name:** [Name]
**One-line description:** [What it does, for whom, and why]
**Current phase:** [Discovery / Alpha / Beta / Production]

---

## Domain Model

Key concepts and the precise language used in this codebase.
Consistency matters — use these exact terms everywhere.

| Term | Definition | Do NOT say |
|---|---|---|
| [Term] | [What it means in this domain] | [Synonyms to avoid] |

---

## Users

| User type | Description | Primary goals |
|---|---|---|
| [Type] | [Who they are] | [What they need] |

---

## Core Flows

1. **[Flow name]** — [1-sentence description]
2. **[Flow name]** — [1-sentence description]

Full flow diagrams: `specs/flows.md`

---

## Business Rules

Rules that MUST be enforced regardless of technical implementation.

- [Rule 1]
- [Rule 2]

---

## Constraints and Non-Goals

**Hard constraints:**
- [Constraint]

**Non-goals (explicitly out of scope):**
- [Non-goal]

---

## Open Questions

Questions that affect design but are not yet resolved.

| Question | Owner | Deadline |
|---|---|---|
| [Question] | [Human / Claude] | [Date or "open"] |

---

## Localization Decisions

| Concern | Authorized approach | Documented in |
|---|---|---|
| Date format | [Format(s) authorized] | `specs/ui-spec.md` |
| Units | [Metric / Imperial / Both] | `specs/ui-spec.md` |
| Language | [Strategy authorized] | `specs/ui-spec.md` |
