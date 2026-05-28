# /intake

Universal entry point for first-session setup and document ingestion.
Use this to initialize a new project, import external documents, or feed in change requests.

Works at any stage — first session or ongoing.

---

## When to Use

- First time opening this project in Claude Code — **with or without existing documentation**
- You have a PRD, vision document, or spec to import
- You have nothing yet — Claude will guide you through setup with a few questions
- You want to feed in an existing change request or backlog item
- You want to update specs from a partial document or meeting notes
- You're extending the project with a new area of scope

---

## Step 1 — Detect Context

Read `sessions/CURRENT-STATE.md` and `sessions/ARCHITECTURE-STATE.md`.

Determine:
- Is this a **first session**? (Phase = BOOTSTRAP, no CRs, specs are empty)
- Is this an **ongoing session with new material to import**?
- What has the user brought in? (see Step 2)

If first session AND no document provided: proceed as a guided first-session setup (Step 3).
If a document is present: proceed to document ingestion (Step 4).

---

## Step 2 — Identify What Was Provided

The user may provide any of the following. Identify the type before proceeding.

| Input type | Description | Target files |
|---|---|---|
| **PRD** (Product Requirements Document) | Full product description with features, users, goals | `specs/vision.md`, `specs/requirements.md`, `specs/entities.md`, `specs/flows.md`, `CONTEXT.md` |
| **Vision / one-pager** | High-level product goals and user description | `specs/vision.md`, `CONTEXT.md` |
| **Technical spec** | Architecture, data model, or API description | `specs/architecture.md`, `specs/entities.md`, `specs/api.yaml`, `specs/nfr.md` |
| **UI spec / wireframes description** | Screen and component descriptions | `specs/ui-spec.md` |
| **Flow description** | User journeys or system flows | `specs/flows.md` |
| **Change request / feature request** | A request for a new feature or change | `change-requests/CR-XXX-title.md` |
| **Partial update** | A section of any of the above | The relevant spec file(s) |
| **Backlog / list of features** | Multiple feature descriptions | One CR per feature |

If the type is unclear: ask the user one question — "What is this document?" — before proceeding.

---

## Step 3 — First-Session Guided Setup (no document)

If this is a BOOTSTRAP project and no document was provided:

1. **Initialize placeholders**: replace any remaining `YYYY-MM-DD` in session files with today's date.

2. **Ask five questions, one at a time:**
   - "What does this product do, and who is it for?"
   - "What is the single most important thing it must do in version 1?"
   - "What is explicitly out of scope for now?"
   - "Do you have a tech stack in mind, or should we decide that later?"
   - "Where will this be deployed? (e.g. Vercel, AWS, GCP, Azure, Fly.io, Heroku, Docker/Kubernetes, self-hosted — or unknown for now)"

3. **Populate from answers:**
   - Write `specs/vision.md` from the first two answers
   - Write non-goals in `specs/vision.md` from the third
   - Note tech stack preference in `sessions/CURRENT-STATE.md`
   - If deployment target is known: populate `specs/deployment.md` with platform, environment table, and a deployment skeleton appropriate for that platform (see deployment scaffolds below)
   - If deployment target is unknown: note "Deployment target not yet decided" in `specs/deployment.md` Status field and `sessions/CURRENT-STATE.md`

4. **Deployment scaffolds** — use the matching skeleton when populating `specs/deployment.md`:

   **Vercel**: Build = `npm run build`, Deploy = git push / Vercel CLI, Env vars in Vercel dashboard, Rollback = Vercel dashboard instant rollback
   **AWS (ECS/Fargate)**: Build = Docker image, Deploy = push to ECR + ECS service update, Migrations before deploy, Rollback = previous task definition
   **AWS (Lambda/Serverless)**: Build = `npm run build`, Deploy = `serverless deploy`, Rollback = `serverless rollback`
   **GCP (Cloud Run)**: Build = Docker image, Deploy = `gcloud run deploy`, Rollback = `gcloud run services update-traffic`
   **Azure (App Service)**: Build = platform-specific, Deploy = `az webapp deploy`, Rollback = deployment slots swap
   **Fly.io**: Build = Dockerfile, Deploy = `fly deploy`, Rollback = `fly releases rollback`
   **Heroku**: Build = auto on git push, Deploy = `git push heroku main`, Rollback = `heroku rollback`
   **Docker / Kubernetes**: Build = Docker image + push to registry, Deploy = `kubectl apply` or Helm, Rollback = `kubectl rollout undo`
   **Self-hosted**: Document manually — capture build, copy, restart, and health check commands

5. **Recommend next step:**
   - "Run `/interview-and-define` to sharpen domain language and populate CONTEXT.md before creating your first CR."

---

## Step 4 — Document Ingestion

### 4a. Parse and extract

Read the provided document. Extract:
- Product goals and description → vision
- User types / personas → CONTEXT.md
- Features and requirements → requirements (FR-XXX format)
- Entities / data model → entities with PII classification prompt
- User flows and system flows → flows
- API or technical details → api.yaml / architecture.md
- Feature requests or change items → CRs

Do not guess at PII classification — flag every field that may contain personal data and ask the user to classify it before writing to entities.md.

### 4b. Present the mapping plan

Before writing anything, present a mapping plan:

```
INTAKE PLAN — [document name or type]

I found the following content and propose mapping it as follows:

1. [Content summary] → specs/vision.md (Product Name, One-Line Description, Goals)
2. [Content summary] → specs/requirements.md (FR-001, FR-002, FR-003)
3. [Content summary] → specs/entities.md (User entity — contains email and name, PII classification needed)
4. [Content summary] → specs/flows.md (Login flow, Registration flow)
5. [Content summary] → change-requests/CR-001-short-title.md (new CR)

Not mapped (out of scope for specs or unclear):
- [item] — reason

Do you want me to proceed with this mapping?
Any sections you want to skip or change?
```

Wait for human confirmation before writing.

### 4c. Handle PII fields

For every entity field that may contain personal data, stop and ask:

"The [Entity] entity contains the field `[field]`. Is this:
- **PII** (identifies a person — e.g. email, phone, IP)
- **Sensitive PII** (Article 9 — health, race, religion, biometrics)
- **Non-PII**"

Document the answer in `specs/entities.md` and note any Sensitive PII fields as requiring GDPR Impact analysis before implementation.

### 4d. Write to files

After confirmation:
- Write each mapped section to the target file
- Preserve existing content — append or merge, never overwrite without showing the diff
- For new CRs: use `change-requests/CR-TEMPLATE.md` and set Status to Draft
- For partial updates: update only the relevant section

### 4e. Summarize and recommend next step

After writing:

```
INTAKE COMPLETE

Updated:
- [file]: [what was added/changed]

Created:
- [file]: [CR number and title]

Flagged for follow-up:
- [item]: [reason — e.g. "PII classification pending for User.phoneNumber"]

Recommended next step:
- [e.g. "Run /interview-and-define to sharpen domain language"]
- [e.g. "Run /create-cr to add the security and GDPR impact analysis to CR-001 before approving it"]
```

---

## Step 5 — Multiple Change Requests from a Backlog

If the user provides a list of features or a backlog:

1. Group items into logical CRs (one CR per coherent unit of work)
2. Propose the grouping and CR titles — wait for approval
3. Create each CR file as a Draft with the feature description in Business Goal and Problem Statement
4. Leave Impact Analysis, Threat Model, and GDPR Impact blank — these require a dedicated `/create-cr` session per CR

```
BACKLOG INTAKE — [N] items → [M] proposed CRs

CR-001: [title] — covers: [items]
CR-002: [title] — covers: [items]

Proceed with this grouping?
```
