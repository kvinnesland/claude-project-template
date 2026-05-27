# /start-session

Execute these steps in order at the start of every session.

## 0. Identify Session Owner

Run: `git config user.name` and `git config user.email`
Record the result in `sessions/CURRENT-STATE.md` under "Session Owner".
Use this name in all ledger entries, decisions, and review reports this session.

If git config returns empty: ask "What is your name or handle?" and set it with
`git config user.name "Name"` before continuing.

## 1. Load Orchestration Files

Read:
- `sessions/CURRENT-STATE.md`
- `sessions/OPEN-ISSUES.md`
- `sessions/DECISIONS.md`
- `sessions/ARCHITECTURE-STATE.md`
- `sessions/IMPLEMENTATION-LEDGER.md`
- `team/GOVERNANCE.md` (if present)
- `team/MEMBERS.md` (if present)

If any session file is missing: stop and flag it.
If `team/MEMBERS.md` is present but the current user (from git config) is not listed: flag it and ask them to add themselves before continuing.

## 2. Summarize Project State

Output:
- Current phase
- Last completed milestone
- Active CRs (ID + title)
- Open blockers

## 3. Identify Next Recommended Task

Based on active CRs and current state, recommend the single most important next task and explain why.

## 4. Generate Execution Plan

Produce a step-by-step plan:
1. What will be done
2. Which specs will be read
3. Which modules will be touched
4. What validation will be run
5. Expected output

Present the plan. Wait for human approval before proceeding.
