# CR-001: Add item library with search and filters

**Status:** Done
**Created:** 2026-01-15
**Author:** ada
**Approved by:** ada
**Approved date:** 2026-01-15

---

## Business Goal
Users need to find previously created items quickly. Today there is no list view — users have no way to browse or search existing records.

## Proposed Solution
Library page with search bar and filter panel. Items displayed as cards with key metadata. Clicking a card opens the detail view (CR-002).

## Impact Analysis

### Affected Specs
- [x] specs/flows.md — add "Browse library" flow
- [x] specs/ui-spec.md — library page, card component, search input, filter panel
- [ ] specs/entities.md — no new fields
- [ ] specs/api.yaml — GET /items already defined in CR-000

### Affected Components
- `pages/Library.tsx` — new page
- `components/ItemCard.tsx` — new component
- `components/SearchBar.tsx` — new component
- `components/FilterPanel.tsx` — new component
- `hooks/useItemSearch.ts` — client-side search and filter logic

### Security Impact
Read-only view of existing data. No new endpoints, no new inputs persisted, no auth changes.
Auth gate on `/library` route — unauthenticated users redirected to login. No threat model required.

### GDPR Impact
N/A — project has GDPR Applicable: false. Items do not contain personal data.

### Performance Impact
Initial load fetches all items for the authenticated user. Acceptable for expected data volume (< 500 items). Revisit with pagination if volume grows.

---

## Acceptance Criteria
- [ ] Authenticated user sees all their items as cards
- [ ] Search filters across title, description, and tags in real time
- [ ] Filters for status, category, and type work independently and combined
- [ ] Empty state shown when no results match
- [ ] Card shows: title, status badge, last modified date
- [ ] Clicking a card navigates to the detail view

## Required Tests
- [ ] Unit: `useItemSearch` — search and filter logic, empty results, combined filters
- [ ] Integration: library page renders correct cards for authenticated user
- [ ] E2E: search + filter combination returns expected subset

## Rollback Strategy
Revert the page and components. Route `/library` redirects to `/` — no data or schema changes to undo.

## Dependencies
- CR-000: Auth and base data model (Done)
