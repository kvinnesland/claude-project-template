# deployment.md — Deployment Specification

> Defines how this application is built, deployed, and rolled back.
> Filled in when tech stack is chosen — see `/intake` or `/create-cr` for tech stack CR.
> Claude reads this file when running `/release` and generating deployment instructions.
> No deployment may proceed without this file being populated.

---

## Status

[ ] Not yet defined — complete this file before the first release.

---

## Hosting Platform

**Platform:** [Vercel / AWS / GCP / Azure / Heroku / Fly.io / Docker / Kubernetes / Self-hosted / Other]
**Region(s):** [e.g. eu-west-1 — note GDPR data residency requirements from specs/nfr.md]
**Environments:**

| Environment | URL / endpoint | Branch / tag |
|---|---|---|
| Development | [local or dev URL] | any |
| Staging | [staging URL] | main |
| Production | [production URL] | tag vX.Y.Z |

---

## Build

**Build command:** [e.g. `npm run build`]
**Output directory:** [e.g. `dist/` or `.next/`]
**Node version / runtime version:** [e.g. Node 20]
**Environment variables required at build time:**

| Variable | Purpose | Secret? |
|---|---|---|
| [VAR_NAME] | [what it does] | Yes / No |

---

## Deploy

**Deploy method:** [Git push / CI/CD auto-deploy / Manual CLI / Container push]
**Deploy command (if manual):** [e.g. `vercel --prod` or `kubectl apply -f k8s/`]
**Deploy triggers:**
- Staging: [e.g. push to main]
- Production: [e.g. git tag vX.Y.Z]

**Environment variables required at runtime:**

| Variable | Purpose | Secret? | Set in |
|---|---|---|---|
| [VAR_NAME] | [what it does] | Yes / No | [platform secrets / .env] |

---

## Database Migrations

**Migration tool:** [e.g. Prisma Migrate / Flyway / Alembic / raw SQL / None]
**Migration command:** [e.g. `npx prisma migrate deploy`]
**Migration order:** Always run migrations **before** deploying new application code.
**Reversibility:** [All migrations must be reversible — document any exceptions here]

---

## Health Check

**Health check endpoint:** [e.g. `GET /api/health`]
**Expected response:** [e.g. `200 OK { "status": "ok" }`]
**Post-deploy verification:** [What to check after a deploy to confirm it succeeded]

---

## Rollback Procedure

**Trigger:** Roll back if health check fails or critical errors spike within [N] minutes of deploy.

**Steps:**
1. [e.g. Redeploy previous git tag: `git tag -d vX.Y.Z && git push --delete origin vX.Y.Z`]
2. [e.g. Revert database migration: `npx prisma migrate resolve --rolled-back`]
3. [e.g. Verify health check passes on previous version]
4. [e.g. Notify team via [channel]]

**Rollback decision owner:** [Role / person responsible for triggering rollback]

---

## Monitoring and Alerting

**Error tracking:** [e.g. Sentry / Datadog / CloudWatch / None]
**Uptime monitoring:** [e.g. BetterUptime / Pingdom / None]
**Log aggregation:** [e.g. Datadog Logs / CloudWatch Logs / None]
**Alert recipients:** [e.g. PagerDuty / Slack #alerts]

**Key alerts to configure:**
- [ ] Error rate spike (threshold: [X]% errors over [N] minutes)
- [ ] P95 latency above [N]ms
- [ ] Health check failure
- [ ] Disk/memory above [X]%

---

## CI/CD Pipeline

**CI provider:** [GitHub Actions / GitLab CI / CircleCI / Other]
**Pipeline file:** [.github/workflows/deploy.yml or equivalent]

Stages:
1. Validate (existing `.github/workflows/validate.yml`)
2. Test
3. Build
4. Deploy to staging (on merge to main)
5. Deploy to production (on tag vX.Y.Z)

> Note: The deploy pipeline is separate from the validate pipeline.
> Create `.github/workflows/deploy.yml` when deployment target is confirmed.
