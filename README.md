# Claude Project Template

A governed, AI-native repository structure for building software with Claude Code across multiple sessions.

## What this is

A project scaffold that gives you:
- Session continuity across Claude Code sessions
- Change request (CR) governance
- Spec-driven development
- Traceability (CR → spec → code → test)
- Agent role definitions
- Security and GDPR governance
- Review checklists

## Setup

1. Clone or fork this template
2. Install the git hook: `sh hooks/install.sh`
3. Start Claude Code in this directory
4. Type `/start-session` in the Claude Code chat

## How commands work

Commands like `/start-session` are **Claude Code custom commands** — type them directly in the chat with Claude. Claude reads the corresponding file in `.claude/commands/` and executes the steps defined there. They are not shell scripts.

| Command | When to use |
|---|---|
| `/intake` | **Start here** — first session setup, import PRD/spec/CR, feed in backlog |
| `/start-session` | Beginning of every subsequent session — loads state and produces a plan |
| `/end-session` | End of every session — updates all state files |
| `/interview-and-define` | First session, or when domain language is unclear |
| `/create-cr` | Before any new work — creates a Change Request |
| `/implement` | After a CR is approved — begins implementation |
| `/review` | Before merging — runs the full review checklist |
| `/release` | Prepare release: checklist, CHANGELOG, version bump, tag, deploy instructions |
| `/gdpr-report` | Consolidated GDPR compliance report across all sources |
| `/security-report` | Consolidated security posture report across all sources |

## How agent roles work

Claude automatically adopts the relevant agent role based on the task. The roles are defined in `.claude/agents/` and constrain what Claude may and may not do:

| Role | File | Active when |
|---|---|---|
| Architect | `agents/architect.md` | Structural changes, new modules, dependency decisions |
| Backend | `agents/backend.md` | API, service, and data layer implementation |
| Frontend | `agents/frontend.md` | UI implementation — strict localization rules apply |
| Security | `agents/security.md` | Threat modeling and security review on every CR |
| Privacy | `agents/privacy.md` | GDPR assessment on every CR touching personal data |
| QA | `agents/qa.md` | Test strategy and coverage |
| Reviewer | `agents/reviewer.md` | Pre-merge review checklist |

## Session workflow

```
/start-session → /create-cr → /implement → /review → /end-session
```

Every change must have an approved CR before implementation begins.

## Branching strategy

Default: **one branch per CR**.

```
git checkout -b feature/CR-001-short-title
# ... implement ...
# merge to main after /review passes
```

Document the active branch in `sessions/CURRENT-STATE.md`.
Keep `main` always in a deployable state.

## First session checklist

- [ ] `sh hooks/install.sh` — install commit-msg hook
- [ ] `/intake` — import your PRD, vision doc, or spec; or start with guided setup if you have nothing yet
- [ ] `/interview-and-define` — sharpen domain language, populate `CONTEXT.md`
- [ ] `/create-cr` — create CR-001 with full impact analysis before implementation

## Structure

```
.claude/            — Claude Code configuration, agents, commands
sessions/           — Session state (read/updated every session)
specs/              — Living specifications (vision, entities, flows, API, UI)
change-requests/    — One file per CR
reviews/            — Review checklists (general, security, GDPR, architecture, UX)
rules/              — Governance rules
gdpr/               — GDPR compliance artifacts (RoPA, processors, DPIA)
validation/         — Validation scripts (run in CI)
hooks/              — Git hooks
.github/workflows/  — CI pipeline
```
