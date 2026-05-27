# DECISIONS.md

> Append-only. Document every significant architectural or governance decision.

---

## Operational Decisions

Format:
```
DATE: YYYY-MM-DD
DECISION: [short title]
CONTEXT: [why was this needed]
DECISION: [what was decided]
ALTERNATIVES CONSIDERED: [what else was evaluated]
RATIONALE: [why this option]
CONSEQUENCES: [what this enables or constrains]
DECIDED BY: [Name / handle] | Claude | [Name / handle] + Claude
```

## Decisions

---

## Architectural Decisions

These are hard-to-reverse, structurally significant decisions worth preserving for future readers.
Only add an entry when all three are true:
1. Hard to reverse — changing it later has meaningful cost
2. Surprising without context — a future reader would wonder "why did they do it this way?"
3. Result of a real trade-off — genuine alternatives existed

Format:
```
# [Short title]

[1-3 sentences: context, what was decided, and why.]

Status: accepted | deprecated | superseded by [title]
Date: YYYY-MM-DD
Considered alternatives: [only if rejection is non-obvious]
Consequences: [only if non-obvious downstream effects]
```
