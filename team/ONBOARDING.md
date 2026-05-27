# Onboarding Guide

> For new team members joining this project.
> Read this before your first session. Takes 10–15 minutes.

---

## 1. What We Are Building

See `specs/vision.md` for the full product description.

**Short version:** [fill in after running /interview-and-define]

**Current phase:** See `sessions/CURRENT-STATE.md`

---

## 2. Local Setup

```bash
# Clone the repo
git clone <repo-url>
cd <repo-name>

# Install validation dependencies
npm install

# Install the commit-msg hook (enforces CR references in commits)
sh hooks/install.sh

# Verify your git identity matches what you'll use in this project
git config user.name   # should return your name
git config user.email  # should return your email

# If not set:
git config user.name "Your Name"
git config user.email "your@email.com"
```

---

## 3. Register as a Team Member

Add yourself to `team/MEMBERS.md` before your first session.
Claude will flag you as an unknown approver if you are not listed.

```
| Your Name | your@email.com | Contributor | YYYY-MM-DD |
```

Commit the change:
```bash
git checkout -b feature/add-[yourname]-to-team
git add team/MEMBERS.md
git commit -m "INFRA: add [yourname] to team/MEMBERS.md"
git push -u origin feature/add-[yourname]-to-team
```

---

## 4. How This Project Works

This project uses a **governed, spec-driven workflow** with Claude Code.
Every change goes through a fixed process — no exceptions.

### The workflow

```
/start-session → /create-cr → [specs updated] → /implement → /review → merge → /end-session
```

**You never write code without an approved CR.** If there is no CR, there is no change.

### Sessions

Every working session starts with `/start-session` and ends with `/end-session`.
Type these commands in the Claude Code chat.
Claude reads the current project state, produces a plan, and waits for your approval before doing anything.

### Change Requests (CRs)

A CR is a document that describes *why* a change is needed, *what* it involves, and *what risks it carries* — before any code is written.

CRs live in `change-requests/`. Each CR goes through:
`Draft → In Review → Approved → In Progress → Done`

You cannot start implementing until a CR is Approved by someone other than yourself.

### Reviews

Before any CR is merged, `/review` runs a full checklist covering:
traceability, architecture, type safety, testing, security, GDPR, and UX.

A failing item blocks the merge — it cannot be waived without a written reason.

---

## 5. Key Rules

These are the most important things to know. The full rules are in `rules/` and `.claude/CLAUDE.md`.

| Rule | Why |
|---|---|
| No code without an approved CR | Prevents undocumented changes and architectural drift |
| Self-approval is allowed by default | Projects can restrict this in `team/GOVERNANCE.md` |
| Specs update before code | `specs/` is the source of truth — code follows specs, never the reverse |
| Every commit references a CR | `git commit -m "Add login endpoint (CR-003)"` — the hook enforces this |
| No hardcoded secrets | Use environment variables. The CI pipeline scans for secrets. |
| No hardcoded dates, units, or text in frontend | Stop and ask before implementing — see `rules/frontend-localization/RULE.md` |

---

## 6. What Claude Does and Doesn't Do

**Claude does:**
- Reads specs and CRs, then produces implementation plans
- Writes code, tests, and documentation
- Runs review checklists and produces reports
- Manages session state files
- Flags governance violations (self-approval, missing CR, etc.)

**Claude does not:**
- Approve its own work — human sign-off always required
- Make architectural decisions without your approval
- Merge or push to main without your confirmation
- Override a FAILED review item

---

## 7. Where Things Live

```
specs/              Living specifications — source of truth for everything
change-requests/    One file per CR — your primary working document
sessions/           Project state — read at session start, updated at session end
team/               This file, GOVERNANCE.md, MEMBERS.md
rules/              Governance rules Claude enforces
reviews/            Checklists for review, security, GDPR, release
gdpr/               GDPR compliance artifacts (RoPA, processors, DPIAs)
validation/         Automated checks — run in CI on every push
hooks/              Git hooks — install once with sh hooks/install.sh
.claude/            Claude Code configuration (agents, commands)
```

---

## 8. Your First Session

1. Open Claude Code in this directory
2. Type `/start-session`
3. Claude will read the current state and ask who you are (via git config)
4. Review the plan Claude produces — ask questions, request changes
5. If there is active work: ask Claude to walk you through the current CR
6. If there is no active work: run `/create-cr` to define what you will build

---

## 9. Questions

Check these first:
- `sessions/CURRENT-STATE.md` — what is the project currently doing?
- `sessions/OPEN-ISSUES.md` — what is blocked or in progress?
- `sessions/DECISIONS.md` — why were things done this way?
- `team/GOVERNANCE.md` — what can you approve?

If still unclear: ask a team member listed in `team/MEMBERS.md`.
