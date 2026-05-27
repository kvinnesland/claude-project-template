# CLAUDE.md — AI Operating Model

> This file is read automatically by Claude Code at session start.
> It defines how Claude must behave in this repository.

---
## Project Initialization — First Run Only

When Claude Code is opened in this project for the first time, check all files in `sessions/` for the placeholder `YYYY-MM-DD`.

If the placeholder is found, replace every occurrence with today's actual date before doing anything else.

Files to check:
- `sessions/CURRENT-STATE.md`
- `sessions/IMPLEMENTATION-LEDGER.md`
- `sessions/OPEN-ISSUES.md`
- `sessions/DECISIONS.md`
- `sessions/ARCHITECTURE-STATE.md`

How to detect first run: check all five session files listed above for the string `YYYY-MM-DD`. If any file contains it, this is an uninitialized project. Replace all occurrences across all five files, save them, then proceed with normal session startup.

## Session Startup — Required Steps

Before ANY implementation work, Claude MUST:

1. Read `sessions/CURRENT-STATE.md`
2. Read `sessions/OPEN-ISSUES.md`
3. Read all active change requests in `/change-requests`
4. Read impacted specs in `/specs`
5. Validate architecture consistency against `sessions/ARCHITECTURE-STATE.md`
6. If `CONTEXT.md` exists at the repo root, read it
7. Produce an explicit implementation plan and present it before proceeding

If any of these files are missing or incomplete, stop and flag it.

---

## Session Shutdown — Required Steps

At the end of EVERY session, Claude MUST:

1. Update `sessions/CURRENT-STATE.md`
2. Append completed work to `sessions/IMPLEMENTATION-LEDGER.md`
3. Update `sessions/OPEN-ISSUES.md`
4. Document architectural decisions in `sessions/DECISIONS.md`
5. Document unfinished work and blockers
6. Document risks introduced
7. Document recommended next actions

---

## Forbidden Behavior

Claude MUST NEVER:

- Implement undocumented changes (no CR = no change)
- Violate module boundaries defined in `specs/architecture.md`
- Bypass validation scripts in `/validation`
- Skip review checklists in `/reviews`
- Duplicate abstractions that already exist
- Silently change architecture
- Refactor unrelated systems during feature work

### Frontend — Localization (see `rules/frontend-localization/RULE.md` for full detail)

- **Date/time formats**: Never hardcode a date or time format in the frontend. Stop, present format options to the human, wait for written authorization, document in the CR and `specs/ui-spec.md`, then implement with a shared formatting utility and a user-facing setting.
- **Units of measurement**: Never hardcode unit labels (kg, miles, °F, etc.) in the frontend. Stop, present Metric vs Imperial options to the human, wait for written authorization, document in the CR and `specs/ui-spec.md`, then implement with a shared conversion utility and a user-facing setting.
- **Labels and text**: Never hardcode visible user-facing strings directly in components. Stop, present language strategy options (single-language with i18n infrastructure vs multi-language with locale switching) to the human, wait for written authorization, document in the CR and `specs/ui-spec.md`, then implement with the project's i18n utility.

---

## Required Behavior

Claude MUST ALWAYS:

- Maintain full traceability (CR → spec → code → test)
- Update orchestration files at session end
- Add tests for every new behavior
- Document risks and assumptions explicitly
- Preserve modular boundaries
- Reference the active CR in every commit message

---

## Agent Roles

| Task | Agent file |
|---|---|
| Architecture decisions | `.claude/agents/architect.md` |
| API / backend work | `.claude/agents/backend.md` |
| UI / frontend work | `.claude/agents/frontend.md` |
| Code review | `.claude/agents/reviewer.md` |
| Security review | `.claude/agents/security.md` |
| Testing / QA | `.claude/agents/qa.md` |

---

## Commands

| Command | Purpose |
|---|---|
| `/start-session` | Load state, identify blockers, generate plan |
| `/end-session` | Summarize work, update all orchestration files |
| `/interview-and-define` | Interview plan, sharpen domain language, update CONTEXT.md |
| `/create-cr` | Create a new change request with impact analysis |
| `/review` | Run full review checklist |
| `/implement` | Begin implementation from an approved CR |

---

## Architecture Principles

1. Maintainability
2. Explicitness — no implicit behavior
3. Traceability — every change has a paper trail
4. Modularity — clear boundaries between layers
5. Deterministic workflows — same input = same process
6. Low architectural drift
7. Safe refactoring
8. Long-term AI collaboration
