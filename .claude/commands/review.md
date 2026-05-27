# /review

Run the full review checklist before any merge.

## Checklist

The authoritative checklist lives in `reviews/REVIEW-CHECKLIST.md`.
Read it and evaluate every item. Mark each as PASSED, FAILED, or WAIVED (with written reason).

## Output Format

```
REVIEW REPORT — [Date] — CR-XXX

PASSED:
- [item]

FAILED:
- [item] — [reason]

WAIVED:
- [item] — [reason]

RECOMMENDATION: Approve | Request Changes | Reject
```

A single FAILED item without waiver = Request Changes.
A FAILED item on Traceability, Security, or Architecture = Reject.
