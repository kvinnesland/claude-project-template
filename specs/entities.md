# entities.md — Data Entities

> Define all business entities here.
> This is the source of truth for data models.
> No entity may appear in code that is not defined here.

## Entity: [Name]

Description: [What is this entity?]

**GDPR:**
- Contains personal data: Yes / No
- Legal basis: [Art. 6(1)(?) — reason]
- Retention period: [Duration and trigger, e.g. "3 years after last login"]
- Deletion mechanism: [How and when deleted]

Fields:
- id: string (uuid, required) — Non-PII
- [field]: [type] ([required/optional], [validation rules]) — [PII | Sensitive PII | Non-PII]
- createdAt: string (ISO 8601, required) — Non-PII

> PII field classification:
> - **Non-PII**: cannot identify a natural person
> - **PII**: can identify a person (name, email, IP, device ID, behavioral data, etc.)
> - **Sensitive PII**: Article 9 categories (health, race, religion, biometrics, etc.) — stricter controls

Relations:
- has_many: [Entity]
- belongs_to: [Entity]

Indexes:
- [field] (unique)
