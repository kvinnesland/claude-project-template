# Rule: Frontend Localization

> These rules apply to ALL frontend implementation.
> No exceptions without explicit human authorization documented in the active CR.

---

## 1. Date and Time Formatting

Claude MUST NEVER hardcode a date or time format in the frontend.

**Required behavior:**
- Present the user with at least the following format options for authorization:
  - `DD.MM.YYYY` (Norwegian/European)
  - `MM/DD/YYYY` (US)
  - `YYYY-MM-DD` (ISO 8601)
  - `D. MMMM YYYY` (Long-form, locale-aware)
  - Relative (`2 days ago`, `just now`)
- The authorized format must be documented in `specs/ui-spec.md`
- The application must expose a **date format setting** in user settings, allowing the end-user to switch between all supported formats at runtime
- All date rendering must go through a single shared formatting utility — never inline

**Forbidden:**
- Hardcoding any date format string (e.g. `DD/MM/YYYY`) without CR authorization
- Using different formats in different parts of the UI without explicit mapping in `specs/ui-spec.md`
- Rendering raw ISO strings directly to the UI

---

## 2. Units of Measurement

Claude MUST NEVER hardcode a unit system in the frontend.

**Required behavior:**
- Present the user with unit system options for authorization:
  - **Metric** — km, kg, cm, °C, L, m²
  - **Imperial** — mi, lb, in/ft, °F, gal, ft²
- The authorized unit system must be documented in `specs/ui-spec.md`
- The application must expose a **unit system setting** in user settings, allowing the end-user to switch between Metric and Imperial at runtime
- All unit rendering and conversion must go through a single shared utility — never inline
- Raw numeric values must always be stored and transmitted in a canonical unit (SI base units recommended); conversion happens at render time only

**Forbidden:**
- Hardcoding unit labels (e.g. `kg`, `miles`) without CR authorization
- Mixing unit systems across the UI
- Performing unit conversion in business logic or API layer

---

## 3. Labels, Text, and Language

Claude MUST NEVER hardcode visible user-facing text strings directly in components.

**Required behavior:**
- Default approach is **language-independence**: all visible strings must be externalized into a translation/string resource file from day one, even if only one language is initially supported
- Present the user with a language strategy for authorization:
  - **Single language with i18n infrastructure** (default — strings externalized, ready for translation)
  - **Multi-language with locale switching** (full i18n with runtime locale selection)
- The authorized strategy must be documented in `specs/ui-spec.md`
- The application must expose a **language setting** in user settings if multi-language is authorized
- All string rendering must go through the project's i18n utility — never raw string literals in JSX/templates

**Forbidden:**
- Hardcoding any user-visible string directly in a component
- Using a mix of externalized and inline strings
- Adding a new language without a CR covering translation completeness and fallback behavior

---

## Authorization Process

When a frontend task requires date formatting, units, or text labels, Claude MUST:

1. Stop before implementing
2. Present the options listed above to the human
3. Wait for explicit written authorization of the chosen approach
4. Document the decision in the active CR under "UX Impact"
5. Update `specs/ui-spec.md` with the authorized format/system/strategy before writing code
