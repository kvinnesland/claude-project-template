# /gdpr-report

Produce a consolidated GDPR compliance report by reading all relevant files.
Use this for internal oversight, DPO review, or documentation to regulators.

## 1. Read All GDPR-Relevant Sources

Read in this order:

1. `gdpr/RoPA.md` — processing activities
2. `gdpr/processors.md` — third-party processors and DPA status
3. `specs/entities.md` — all entities with PII field classifications
4. `specs/nfr.md` — privacy section (data residency, encryption, DPO, supervisory authority)
5. `specs/api.yaml` — API responses that may expose personal data
6. All files matching `gdpr/DPIA-*.md` — active DPIAs
7. All files in `change-requests/` with status Approved, In Progress, or Done — GDPR Impact sections
8. `reviews/GDPR-REVIEW.md` — review checklist (to assess completeness)

If a file is missing or still contains template placeholders, note it as a gap.

## 2. Produce the Report

Output the report in the structure below.
Be factual — do not guess at legal correctness. Flag gaps explicitly.

---

```
# GDPR Compliance Report
Generated: [today's date]
Project: [from specs/vision.md]

---

## 1. Executive Summary

[2–4 sentences: overall compliance posture, number of processing activities,
number of processors, any critical gaps requiring immediate action]

---

## 2. Processing Activities

Source: gdpr/RoPA.md

| Activity | Legal basis | Data subjects | Retention | Deletion mechanism | DPIA |
|---|---|---|---|---|---|
| [name] | [Art. 6 basis] | [who] | [period] | [how] | Yes/No |

Gaps:
- [Any activity missing legal basis, retention period, or deletion mechanism]

---

## 3. Personal Data Inventory

Source: specs/entities.md

| Entity | PII fields | Sensitive (Art. 9) fields | Legal basis | Retention |
|---|---|---|---|---|
| [name] | [field list] | [field list or —] | [basis] | [period] |

Gaps:
- [Any entity with PII fields but missing legal basis or retention]
- [Any field missing PII classification]

---

## 4. Third-Party Processors

Source: gdpr/processors.md

| Processor | Data shared | DPA in place | Data location | Transfer mechanism |
|---|---|---|---|---|
| [vendor] | [categories] | Yes/No | [country/region] | [adequacy/SCC/BCR/—] |

Gaps:
- [Any processor without DPA]
- [Any cross-border transfer without documented mechanism]

---

## 5. DPIA Status

Source: gdpr/DPIA-*.md files and CR GDPR Impact sections

| CR | DPIA triggered | DPIA file | Status | Reviewer |
|---|---|---|---|---|
| [CR-XXX] | Yes/No | [filename or —] | [Draft/Reviewed/Approved] | [name or pending] |

Gaps:
- [Any CR where DPIA was triggered but file is missing or not reviewed]

---

## 6. Data Subject Rights Coverage

Based on entities, flows, and API spec — assess whether each right is implementable:

| Right | Article | Status | Notes |
|---|---|---|---|
| Access | Art. 15 | Implemented / Partial / Not implemented | [how] |
| Erasure | Art. 17 | Implemented / Partial / Not implemented | [how] |
| Portability | Art. 20 | Implemented / Partial / Not implemented | [how] |
| Rectification | Art. 16 | Implemented / Partial / Not implemented | [how] |
| Objection | Art. 21 | Implemented / Partial / Not implemented | [how] |

---

## 7. Technical Controls

Based on specs/nfr.md and entities.md:

| Control | Status | Notes |
|---|---|---|
| Encryption at rest | Defined / Not defined | [standard or gap] |
| Encryption in transit | Defined / Not defined | [TLS version or gap] |
| Pseudonymization | Applied / Not applied | [where or gap] |
| Access controls | Defined / Not defined | [approach or gap] |
| PII excluded from logs | Enforced / Not enforced | [mechanism or gap] |

---

## 8. Compliance Gaps — Prioritized

[List all gaps identified above, ranked by risk:]

CRITICAL (blocks go-live):
- [ ] [gap description] — [which file to update]

HIGH (resolve before first user data):
- [ ] [gap description] — [which file to update]

MEDIUM (resolve before production scale):
- [ ] [gap description] — [which file to update]

LOW (hygiene / documentation):
- [ ] [gap description] — [which file to update]

---

## 9. Recommended Next Actions

[Numbered list of concrete actions, each referencing a specific file or CR:]

1. [Action] → update [file] / create [CR]
2. ...

---

## Sources Read

- gdpr/RoPA.md — [entries found / empty template]
- gdpr/processors.md — [entries found / empty template]
- specs/entities.md — [N entities, N PII fields]
- gdpr/DPIA-*.md — [N files / none]
- change-requests/ — [N CRs with GDPR Impact sections]
```

---

## 3. Save the Report (Optional)

If the user wants to save the report:

Save output to `gdpr/GDPR-REPORT-[YYYY-MM-DD].md`.
Do not commit automatically — let the user review and commit when ready.
