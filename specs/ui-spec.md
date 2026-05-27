# ui-spec.md — UI Specification

> Define all screens, components, and design tokens here before implementation.
> No UI may be implemented that is not defined here.
> Claude reads this file when implementing frontend features.
> Localization decisions (date formats, units, language) are documented here once authorized.

---

## Design Tokens

All visual constants must be defined as tokens. Never hardcode values in components.

### Colors
| Token | Value | Usage |
|---|---|---|
| `color-primary` | [hex] | Primary actions, links |
| `color-error` | [hex] | Error states |
| `color-surface` | [hex] | Card and panel backgrounds |

### Typography
| Token | Value | Usage |
|---|---|---|
| `font-size-base` | [value] | Body text |
| `font-size-heading-1` | [value] | Page titles |

### Spacing
| Token | Value | Usage |
|---|---|---|
| `spacing-xs` | [value] | Tight gaps |
| `spacing-md` | [value] | Standard padding |
| `spacing-lg` | [value] | Section separation |

---

## Localization Settings

Authorized formats — filled in after human sign-off per `rules/frontend-localization/RULE.md`.

| Concern | Authorized approach | CR reference |
|---|---|---|
| Date format | [Not yet authorized] | — |
| Units | [Not yet authorized] | — |
| Language strategy | [Not yet authorized] | — |

---

## Screen Template

Copy this block for each screen.

```
## Screen: [Name]

**Route**: [URL path, e.g. /dashboard]
**Access**: Public | Authenticated | Role: [role name]
**Related flow**: `specs/flows.md` — [Flow name]
**CR**: [CR-XXX]

### Layout
[Describe layout — sidebar, header, content area — or reference a wireframe]

### Sections / Components
- [Component name]: [what it does and what data it shows]

### States
- **Loading**: [what is shown while data fetches]
- **Empty**: [what is shown when there is no data]
- **Error**: [what is shown on failure]
- **Success / Default**: [the normal populated state]

### Localization
- Dates displayed: [which format token is used]
- Units displayed: [which unit system]
- Strings: [i18n key prefix for this screen]
```

---

## Component Template

Copy this block for each reusable component.

```
## Component: [Name]

**Type**: Layout | Form | Display | Interactive | Feedback
**Used on**: [Screen names]
**CR**: [CR-XXX]

### Inputs / Props
| Name | Type | Required | Description |
|---|---|---|---|
| [name] | [type] | Yes/No | [what it controls] |

### States
- Default: [description]
- Loading: [description]
- Error: [description]
- Disabled: [description]

### Accessibility
- ARIA role: [role if non-semantic element]
- Keyboard: [Tab stops, Enter/Space behavior]
- Focus management: [where focus goes on open/close/submit]
- Screen reader: [what is announced]
```

---

## Screens

<!-- Add screen definitions below. -->

---

## Components

<!-- Add component definitions below. -->
