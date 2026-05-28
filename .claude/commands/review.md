# /review

Run the review checklist before any merge.

## 0. Determine Review Depth

Check the CR type:
- Minor CR (`CR-MINOR-TEMPLATE.md`) → use `reviews/REVIEW-MINOR-CHECKLIST.md`
- Feature CR (`CR-TEMPLATE.md`) → use `reviews/REVIEW-CHECKLIST.md`

If `GDPR Applicable: false` in `sessions/CURRENT-STATE.md`: skip the GDPR section of the checklist.

## Checklist

Read the appropriate checklist and evaluate every item. Mark each as PASSED, FAILED, or WAIVED (with written reason).

See `examples/REVIEW-CR-001.md` for a complete filled-in example.

## Output Format

```
REVIEW REPORT — YYYY-MM-DD — CR-XXX
Reviewer: [Name / handle]

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
