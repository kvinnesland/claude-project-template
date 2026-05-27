# flows.md — Business Flows

> Define all critical user and system flows here before implementation.
> Each flow maps to implementation in the service layer.
> No flow may be implemented that is not defined here.
> Claude reads this file when implementing services and writing tests.

---

## Flow Template

Copy this block for each new flow.

```
## Flow: [Name]

**Type**: User flow | System flow | Background job
**Trigger**: [What initiates this flow — user action, event, schedule, etc.]
**Actor**: [User role / System / External service]
**Preconditions**: [What must be true before this flow starts]

### Steps
1. [Actor] [action]
2. System [validates / processes / responds]
3. ...

### Alternate Paths
- **[Condition]**: [What happens instead of the happy path]

### Error States
- **[Error condition]**: [How the system responds — what the user sees, what is logged]

### Postconditions
[What is guaranteed to be true when this flow completes successfully]

### Related
- API: `specs/api.yaml` — [endpoint(s) involved]
- Entities: `specs/entities.md` — [entity names read or written]
- UI: `specs/ui-spec.md` — [screen(s) involved]
- CR: [CR-XXX if this flow was introduced by a specific CR]
```

---

## Flows

<!-- Add flows below. One section per flow. -->
