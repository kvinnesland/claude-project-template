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

> Default: **anyone on the team can approve anything, including their own work.**
> Override specific rules below if your project needs stricter controls.

| Action | Default rule | Project override |
|---|---|---|
| Approve a CR | Any team member | — |
| Sign off security review | Any team member | — |
| Sign off GDPR review | Any team member | — |
| Authorize a release | Any team member | — |
| Approve architecture change | Any team member | — |
| Merge to main | Any team member | — |

**To override**: replace "—" with the required role or constraint, e.g.:
- `"Owner only"` — restricts to a specific role
- `"Any team member except the CR author"` — disables self-approval for this action
- `"Requires 2 approvals"` — raises the threshold

---

## Optional Restrictions

Uncomment and configure as needed for your project:

```
## Active restrictions
# | Approve a CR           | Any team member except the CR author   |
# | Merge to main          | Requires at least 1 other approval     |
# | Sign off security review | Owner only                           |
```

---

## Always Required

These apply regardless of permission configuration:

- **Human sign-off**: Claude can produce reviews and recommendations but cannot be the sole approver — a human must sign off
- **Author recorded**: every CR, review, decision, and ledger entry must record the name/handle of the person responsible
