# Rule: GDPR and Privacy

> Privacy is a design constraint, not a compliance checkbox.
> These rules apply to every CR that touches personal data — directly or indirectly.

---

## Definitions

**Personal data**: any information relating to an identified or identifiable natural person.
Examples: name, email, phone, IP address, device ID, location, behavioral data, inferred attributes.

**Sensitive personal data (Article 9)**: health, racial/ethnic origin, political opinions,
religious beliefs, trade union membership, genetic/biometric data, sex life/sexual orientation.
Requires explicit consent or specific legal basis. Stricter controls apply.

**Data subject**: the natural person the data is about.

**Controller**: the entity deciding why and how data is processed (typically: this product).

**Processor**: a third-party service processing data on the controller's behalf (requires a DPA).

---

## Legal Bases (Article 6) — One Must Apply to Every Processing Activity

| Basis | When to use |
|---|---|
| Consent | User explicitly opts in; must be withdrawable |
| Contract | Necessary to fulfill a contract with the user |
| Legal obligation | Required by law |
| Vital interests | Life-or-death situations |
| Public task | Official authority functions |
| Legitimate interest | Balanced against user rights; requires LIA |

**Sensitive data (Art. 9)**: requires explicit consent or another Art. 9(2) exception.

---

## Mandatory for Every CR Touching Personal Data

1. **GDPR Impact section completed** in the CR before approval
2. **Legal basis documented** — which Article 6 basis, and why it applies
3. **Data minimization verified** — only the minimum fields necessary are collected
4. **Retention period defined** — documented in `gdpr/RoPA.md` and `specs/entities.md`
5. **DPIA assessed** — required if high risk (see DPIA trigger list below)
6. **Third-party processors identified** — DPAs must be in place before go-live
7. **Data subject rights considered** — how are access, deletion, portability, and rectification supported?

---

## DPIA Triggers (Article 35)

A Data Protection Impact Assessment is required if the CR involves:
- Systematic profiling with legal or significant effects
- Large-scale processing of sensitive (Art. 9) data
- Systematic monitoring of publicly accessible areas
- Matching or combining datasets in unexpected ways
- Processing data of vulnerable subjects (children, employees)
- New technology with uncertain privacy impact
- Automated decision-making with significant effects

When triggered: document in CR, create `gdpr/DPIA-[CR-number].md`, get DPO/legal review.

---

## Records of Processing Activities (Article 30)

Every processing activity must be recorded in `gdpr/RoPA.md`.
Update RoPA whenever a CR introduces, modifies, or removes a processing activity.
RoPA is a legal requirement — not optional.

---

## Data Retention

- Every entity storing personal data must have a documented retention period in `specs/entities.md`
- Deletion must be automated or have a documented manual process
- Retention periods must be communicated to users (privacy notice)

---

## Third-Party Processors

- Every third-party service receiving personal data must have a signed DPA
- Document in `gdpr/processors.md`
- Cross-border transfers outside EEA require SCCs, adequacy decision, or BCRs

---

## Forbidden

Claude MUST NEVER:

- Collect personal data without a documented legal basis
- Store sensitive (Art. 9) data without explicit consent or documented Art. 9(2) exception
- Log personal data (email, name, phone, IDs) in plain text — use pseudonymization or masking
- Return personal data in API responses not listed in `specs/api.yaml`
- Add a third-party service receiving personal data without noting it in the CR
- Implement retention without a deletion mechanism
- Build profiling, tracking, or behavioral analysis without DPIA assessment
- Store children's data without documented age verification and parental consent mechanism
