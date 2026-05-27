# GOVERNANCE.md

> Defines who can do what in this project.
> Configured per project — edit this file to match your team's needs.
> Claude reads this file to enforce governance rules.

---

## Team Roster

Add every team member here. Claude uses this to validate approvals.

| Name / handle | Email | Role | Joined |
|---|---|---|---|
| [name] | [email] | [role] | YYYY-MM-DD |

---

## Roles

Define the roles used in this project. Edit freely — roles are project-specific.

Default roles (change or replace as needed):

| Role | Description |
|---|---|
| Owner | Project owner — responsible for final decisions on architecture, security, and releases |
| Contributor | Full team member — can create CRs, implement, review, and approve |

---

## Permissions

> Default: **anyone on the team can approve anything.**
> Override specific rules below if your project needs stricter controls.

| Action | Default rule | Project override |
|---|---|---|
| Approve a CR | Any team member except the CR author | — |
| Sign off security review | Any team member | — |
| Sign off GDPR review | Any team member | — |
| Authorize a release | Any team member | — |
| Approve architecture change | Any team member | — |
| Merge to main | Any team member | — |

**To override**: replace "—" with the required role, e.g. "Owner only" or "Owner or Lead".

---

## Hard Rules (always enforced, regardless of role)

These rules apply to every project and cannot be overridden:

- **No self-approval**: you cannot approve your own CR, your own security review, or your own GDPR review
- **No self-merge**: you cannot merge a branch you authored without at least one other approval
- **Human sign-off required**: Claude can produce reviews and recommendations but cannot be the sole approver on any CR, security review, or GDPR review — a human must approve
- **Author recorded**: every CR, review, decision, and ledger entry must record the name/handle of the person responsible

---

## Minimum Approval Requirements

| Artefact | Minimum approvals | Who |
|---|---|---|
| CR (Draft → Approved) | 1 | Any team member except author |
| Security review | 1 | Any team member (human) |
| GDPR review | 1 | Any team member (human) |
| Release | 1 | Any team member |
| Architecture decision | 1 | Any team member except proposer |
