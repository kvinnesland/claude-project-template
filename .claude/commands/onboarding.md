# /onboarding

Guide for new team members joining this project.
Run this in your first session before doing anything else.

---

## Step 1 — Read the Onboarding Guide

Read `team/ONBOARDING.md` in full. It covers:
- What the project is building
- Local setup (clone, hook install, git config)
- How to register yourself as a team member
- How the CR workflow operates
- Key rules

## Step 2 — Verify Local Setup

Run the following and confirm each step:

```bash
# Hook installed?
ls .git/hooks/commit-msg

# Dependencies installed?
ls node_modules || npm install

# Git identity set?
git config user.name
git config user.email
```

Flag any missing step and help the user resolve it before continuing.

## Step 3 — Register as Team Member

Check `team/MEMBERS.md`. If the current user (from `git config user.name`) is not listed:

1. Add them to the Active Members table:
   ```
   | Name | email | Contributor | YYYY-MM-DD |
   ```
   Replace YYYY-MM-DD with today's date.

2. Commit on a new branch:
   ```bash
   git checkout -b feature/add-[name]-to-team
   git add team/MEMBERS.md
   git commit -m "INFRA: add [name] to team/MEMBERS.md"
   git push -u origin feature/add-[name]-to-team
   ```

## Step 4 — Load Project State

Read:
- `sessions/CURRENT-STATE.md` — what phase is the project in?
- `sessions/OPEN-ISSUES.md` — what is blocked?
- `change-requests/` — are there active CRs?

Summarize for the new team member:
- Current phase
- Active CRs (ID + title + status)
- Any open blockers they should know about

## Step 5 — Recommend Next Action

Based on current state:
- If active CR exists: offer to walk them through it
- If no active CR: suggest running `/create-cr` to define the next piece of work
- If project is in BOOTSTRAP: suggest `/interview-and-define` first
