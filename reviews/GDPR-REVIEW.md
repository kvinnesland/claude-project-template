# GDPR-REVIEW.md

> Required for every CR that introduces, modifies, or removes processing of personal data.
> "Does not touch personal data" must be explicitly stated and verified — not assumed.
> Mark each item: PASS / FAIL / N/A (with written reason).

---

## 1. Scope Check

- [ ] CR explicitly states whether personal data is involved (Yes / No)
- [ ] If No: verified by reviewing all new fields, logs, API responses, and third-party calls

*If no personal data is involved and the above is verified, remaining sections are N/A.*

---

## 2. Legal Basis

- [ ] Legal basis documented in CR (Art. 6 — and Art. 9 if sensitive data)
- [ ] Legal basis is appropriate for the purpose (not just "legitimate interest" by default)
- [ ] If consent: consent is granular, withdrawable, and withdrawal is implemented
- [ ] If legitimate interest: Legitimate Interest Assessment (LIA) documented

---

## 3. Data Minimization

- [ ] Only the minimum personal data necessary for the stated purpose is collected
- [ ] No fields collected "for future use" without a specific, documented purpose
- [ ] Sensitive data (Art. 9) avoided unless strictly necessary and explicitly authorized

---

## 4. Retention and Deletion

- [ ] Retention period documented in CR and `specs/entities.md`
- [ ] Deletion mechanism implemented or explicitly scheduled in backlog
- [ ] Retention period communicated to users (privacy notice updated or noted)

---

## 5. Data Subject Rights

- [ ] Right of access (Art. 15): user can request their data
- [ ] Right to erasure (Art. 17): deletion request is implementable
- [ ] Right to portability (Art. 20): data exportable in machine-readable format (if applicable)
- [ ] Right to rectification (Art. 16): user can correct inaccurate data
- [ ] Right to object (Art. 21): opt-out mechanism exists (if legitimate interest basis)

---

## 6. Third-Party Processors

- [ ] All new third-party services receiving personal data are listed in `gdpr/processors.md`
- [ ] DPA confirmed in place (or noted as required before go-live)
- [ ] Sub-processors of new vendors reviewed
- [ ] Cross-border transfers outside EEA: transfer mechanism documented (adequacy / SCC / BCR)

---

## 7. DPIA

- [ ] DPIA triggers assessed (see `rules/gdpr/RULE.md`)
- [ ] If triggered: `gdpr/DPIA-CR-XXX.md` created and reviewed by DPO/legal before implementation
- [ ] If not triggered: reason documented in CR

---

## 8. Technical Controls

- [ ] Personal data encrypted at rest
- [ ] Personal data encrypted in transit (TLS)
- [ ] Access to personal data restricted to minimum necessary roles
- [ ] Personal data pseudonymized or anonymized where full identification is not required
- [ ] Personal data not logged in plain text — masked or excluded from logs
- [ ] API responses contain only personal data fields listed in `specs/api.yaml`

---

## 9. RoPA

- [ ] `gdpr/RoPA.md` updated with new or modified processing activity
- [ ] Existing RoPA entries updated if this CR changes purpose, retention, or recipients

---

## Output

```
GDPR REVIEW — [Date] — CR-XXX

PASS:
- [item]

FAIL:
- [item] — [remediation required]

N/A:
- [item] — [reason]

RECOMMENDATION: Approve | Request Changes | Reject
Reviewed by: [Name / Claude] — human sign-off required for Approve
```

A FAIL on Legal Basis, DPIA (when triggered), or Sensitive Data = Reject until resolved.
