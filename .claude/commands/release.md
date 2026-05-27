# /release

Prepare and execute a release. Covers CHANGELOG generation, version bump,
pre-release gate, and deployment instructions.

Call with an optional version argument: `/release 1.2.0`
If no version is given, Claude recommends one based on CR types (see Step 2).

---

## Step 1 — Load Context

Read:
- `sessions/CURRENT-STATE.md` — current phase and active CRs
- `sessions/IMPLEMENTATION-LEDGER.md` — all changes since last release
- `CHANGELOG.md` — determine the last released version and the [Unreleased] section
- `specs/deployment.md` — deployment mechanism and rollback procedure
- All CR files with Status: Done — extract Business Goal, type, and CR number

If `specs/deployment.md` still contains template placeholders: **stop**.
```
BLOCKED: specs/deployment.md is not populated.
Complete the deployment spec before proceeding with a release.
See: /intake or create a tech-stack CR to define the deployment mechanism.
```

---

## Step 2 — Determine Version

If no version was passed as argument, recommend one using SemVer:

- Any Done CR that changes a public API contract, removes a field, or breaks backward compatibility → **major**
- Any Done CR that adds a new feature or endpoint → **minor**
- Only bug fixes, security patches, or dependency updates → **patch**

Present recommendation:
```
Proposed version: X.Y.Z
Basis: [CR-XXX introduced a new endpoint (minor bump)]
Type 'yes' to confirm, or provide a different version.
```

Wait for confirmation before proceeding.

---

## Step 3 — Run Release Checklist

Read and evaluate every item in `reviews/RELEASE-CHECKLIST.md`.
Mark each as PASSED, FAILED, or WAIVED (with written reason).

Output the result:
```
RELEASE CHECKLIST — vX.Y.Z — [date]
PASSED: [N items]
FAILED: [list with reasons]
WAIVED: [list with reasons]
```

If any item in sections 1, 2, 3, 4, or 5 is FAILED: **stop and report the blocker**.
Do not proceed until the failure is resolved.

---

## Step 4 — Generate CHANGELOG Entry

From all Done CRs not yet in CHANGELOG, generate an entry:

1. Read each CR's Business Goal, Problem Statement, and Status
2. Categorise each CR:
   - **Added** — new features, endpoints, entities
   - **Changed** — modifications to existing behavior
   - **Fixed** — bug fixes
   - **Security** — security improvements or patches
   - **Deprecated** — features marked for removal
3. Draft the entry:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- CR-001: [Business goal — one-line summary]

### Security
- CR-002: [Business goal — one-line summary]
```

Present the draft. Wait for human confirmation before writing to `CHANGELOG.md`.

---

## Step 5 — Update Files

After confirmation:

1. **Prepend** the new entry to `CHANGELOG.md` above the `[Unreleased]` section.
   Clear the `[Unreleased]` section back to empty bullet points.

2. **Bump version** in `package.json` (if present) to the new version.

3. **Update `sessions/CURRENT-STATE.md`**:
   - Set last released version and date
   - Move released CRs from Active to Released
   - Set next recommended actions

---

## Step 6 — Commit and Tag

```bash
git add CHANGELOG.md package.json sessions/CURRENT-STATE.md
git commit -m "Release vX.Y.Z (INFRA)"
git tag vX.Y.Z
git push origin main --tags
```

Confirm with the user before running git commands.

---

## Step 7 — Deployment Instructions

Read `specs/deployment.md` and output the deployment steps for this release:

```
DEPLOYMENT INSTRUCTIONS — vX.Y.Z

Platform: [from specs/deployment.md]
Tag: vX.Y.Z

Pre-deploy:
[migration command if applicable]

Deploy:
[deploy command from specs/deployment.md]

Post-deploy verification:
[health check procedure from specs/deployment.md]

Rollback (if needed):
[rollback procedure from specs/deployment.md]

Monitoring:
[what to watch for N minutes after deploy]
```

---

## Step 8 — Post-Release

After successful deployment confirm:

- [ ] Health check passed in production
- [ ] No error spikes in monitoring
- [ ] Update `sessions/CURRENT-STATE.md` with deployment confirmed

If deployment fails: follow rollback procedure in `specs/deployment.md`.
Document the incident in `sessions/OPEN-ISSUES.md`.
