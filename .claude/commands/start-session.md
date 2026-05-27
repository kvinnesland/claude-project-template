# /start-session

Execute these steps in order at the start of every session.

## 0. Identify Session Owner

Ask: "Who is running this session? (name or handle)"
Record the answer in `sessions/CURRENT-STATE.md` under "Session Owner".
Use this name in all ledger entries, decisions, and review reports this session.

## 1. Load Orchestration Files

Read:
- `sessions/CURRENT-STATE.md`
- `sessions/OPEN-ISSUES.md`
- `sessions/DECISIONS.md`
- `sessions/ARCHITECTURE-STATE.md`
- `sessions/IMPLEMENTATION-LEDGER.md`

If any file is missing: stop and flag it.

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
