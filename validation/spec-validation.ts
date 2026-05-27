/**
 * spec-validation.ts
 *
 * Validates that specification files are populated and internally consistent.
 * Run via: npx ts-node validation/spec-validation.ts
 * Also runs in CI — see .github/workflows/validate.yml
 *
 * For deep API spec validation (OpenAPI linting), add spectral:
 *   npm install -D @stoplight/spectral-cli
 *   npx spectral lint specs/api.yaml
 *
 * Exit code 0 = all checks passed or skipped
 * Exit code 1 = one or more checks failed
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

type Result = { check: string; status: "PASS" | "FAIL" | "SKIP"; detail?: string };
const results: Result[] = [];

function pass(check: string, detail?: string) { results.push({ check, status: "PASS", detail }); }
function fail(check: string, detail: string) { results.push({ check, status: "FAIL", detail }); }
function skip(check: string, detail: string) { results.push({ check, status: "SKIP", detail }); }

function readFile(rel: string): string | null {
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : null;
}

const PLACEHOLDER = /\[.*?\]/;

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 1: specs/vision.md is populated
// ─────────────────────────────────────────────────────────────────────────────
function checkVisionPopulated() {
  const CHECK = "specs/vision.md is populated";
  const content = readFile("specs/vision.md");
  if (!content) { fail(CHECK, "specs/vision.md not found"); return; }

  if (PLACEHOLDER.test(content)) {
    skip(CHECK, "specs/vision.md still contains template placeholders — populate before starting CR-001");
  } else {
    pass(CHECK);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 2: specs/requirements.md has at least one requirement
// ─────────────────────────────────────────────────────────────────────────────
function checkRequirementsPopulated() {
  const CHECK = "specs/requirements.md has at least one requirement";
  const content = readFile("specs/requirements.md");
  if (!content) { fail(CHECK, "specs/requirements.md not found"); return; }

  const hasFR = /FR-\d+/.test(content);
  const hasNFR = /NFR-\d+/.test(content);

  if (hasFR || hasNFR) {
    const frCount = (content.match(/FR-\d+/g) || []).length;
    const nfrCount = (content.match(/NFR-\d+/g) || []).length;
    pass(CHECK, `${frCount} functional, ${nfrCount} non-functional requirements found`);
  } else {
    skip(CHECK, "No requirements defined yet — add FR-XXX and NFR-XXX entries before implementation");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 3: specs/entities.md has at least one entity defined
// ─────────────────────────────────────────────────────────────────────────────
function checkEntitiesPopulated() {
  const CHECK = "specs/entities.md has at least one entity";
  const content = readFile("specs/entities.md");
  if (!content) { fail(CHECK, "specs/entities.md not found"); return; }

  if (content.includes("[field]: [type]")) {
    skip(CHECK, "specs/entities.md contains template placeholder — populate when data model is defined");
    return;
  }

  const entityCount = (content.match(/^## Entity:/gm) || []).length;
  if (entityCount > 0) {
    pass(CHECK, `${entityCount} entity/entities defined`);
  } else {
    skip(CHECK, "No entities defined yet");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 4: specs/api.yaml is valid YAML and has at least one path (once populated)
// ─────────────────────────────────────────────────────────────────────────────
function checkApiYaml() {
  const CHECK = "specs/api.yaml is structured";
  const content = readFile("specs/api.yaml");
  if (!content) { fail(CHECK, "specs/api.yaml not found"); return; }

  if (!content.includes("openapi:")) {
    fail(CHECK, "specs/api.yaml is missing openapi version field");
    return;
  }

  const hasPaths = content.includes("paths:");
  const hasActualPaths = hasPaths && !/paths:\s*\n(\s*#.*\n)*\s*($|\S)/.test(content);

  if (!hasPaths || !hasActualPaths) {
    skip(CHECK, "specs/api.yaml has no paths defined yet — add endpoints before implementation");
  } else {
    pass(CHECK, "api.yaml has openapi header and path definitions");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 5: specs/flows.md has at least one flow defined
// ─────────────────────────────────────────────────────────────────────────────
function checkFlowsPopulated() {
  const CHECK = "specs/flows.md has at least one flow";
  const content = readFile("specs/flows.md");
  if (!content) { fail(CHECK, "specs/flows.md not found"); return; }

  const hasFlow = /^## Flow:/m.test(content);
  if (hasFlow) {
    const count = (content.match(/^## Flow:/gm) || []).length;
    pass(CHECK, `${count} flow(s) defined`);
  } else {
    skip(CHECK, "No flows defined yet — define flows before implementing services");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 6: Entity names in entities.md are referenced in flows.md (cross-spec)
// ─────────────────────────────────────────────────────────────────────────────
function checkEntitiesReferencedInFlows() {
  const CHECK = "Entities are referenced in flows";
  const entities = readFile("specs/entities.md");
  const flows = readFile("specs/flows.md");

  if (!entities || !flows) { skip(CHECK, "Missing spec files"); return; }

  const entityNames = [...(entities.matchAll(/^## Entity:\s*(.+)$/gm))].map((m) => m[1].trim());
  if (entityNames.length === 0) { skip(CHECK, "No entities defined yet"); return; }

  const flowContent = flows;
  const unreferenced = entityNames.filter((name) => !flowContent.includes(name));

  if (unreferenced.length === 0) {
    pass(CHECK, `All ${entityNames.length} entities referenced in flows`);
  } else if (unreferenced.length === entityNames.length) {
    skip(CHECK, "No flows defined yet — add flows before cross-spec check applies");
  } else {
    fail(
      CHECK,
      `Entities defined but not referenced in any flow:\n  - ${unreferenced.join("\n  - ")}\n  Add these to flows.md or verify they are intentionally flow-independent.`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK 7: specs/nfr.md tech stack is populated once implementation starts
// ─────────────────────────────────────────────────────────────────────────────
function checkNFRTechStack() {
  const CHECK = "specs/nfr.md tech stack is defined";
  const nfr = readFile("specs/nfr.md");
  const archState = readFile("sessions/ARCHITECTURE-STATE.md");

  if (!nfr) { fail(CHECK, "specs/nfr.md not found"); return; }

  const isBootstrap = archState?.includes("BOOTSTRAP") ?? true;
  if (isBootstrap) {
    skip(CHECK, "Project in BOOTSTRAP phase — define tech stack before starting implementation");
    return;
  }

  // If not bootstrap, expect tech stack table to be filled
  const hasStack = nfr.includes("## Tech Stack") &&
    !/\| Layer \| Choice \| Version \|\s*\n\|\-+\|\-+\|\-+\|\s*\n\s*\n/.test(nfr);
  if (hasStack) {
    pass(CHECK);
  } else {
    fail(CHECK, "Tech stack table in specs/nfr.md appears empty — fill in before implementation");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run all checks
// ─────────────────────────────────────────────────────────────────────────────
checkVisionPopulated();
checkRequirementsPopulated();
checkEntitiesPopulated();
checkApiYaml();
checkFlowsPopulated();
checkEntitiesReferencedInFlows();
checkNFRTechStack();

console.log("\n=== Spec Validation Report ===\n");

let failed = 0;
for (const r of results) {
  const icon = r.status === "PASS" ? "✓" : r.status === "SKIP" ? "–" : "✗";
  console.log(`${icon} [${r.status}] ${r.check}`);
  if (r.detail) {
    console.log(`       ${r.detail.replace(/\n/g, "\n       ")}`);
  }
  if (r.status === "FAIL") failed++;
}

console.log(`\n${results.length} checks — ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
