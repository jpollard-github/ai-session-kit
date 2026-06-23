# SaaS Future

## Recommendation

Build the SaaS offering in a new repository.

Keep this repository focused on `AI Session Kit`, the VS Code extension. Use it as:

- the workflow prototype
- the product-language source
- the place where local-editor UX continues to evolve
- a future client/integration point for the SaaS

This repo already has valuable product logic, but its current architecture is intentionally optimized for a lightweight local extension, not a hosted multi-user application.

## Why A New Repo Is The Better Default

- The current product contract is explicitly a VS Code extension.
- The implementation is tightly coupled to VS Code APIs, local workspace files, clipboard flows, and `.vscode/ai-context.json`.
- The docs repeatedly emphasize local, conservative, review-oriented behavior rather than always-on hosted state.
- A SaaS needs different concerns from day one:
  - auth
  - billing
  - database-backed projects
  - team access
  - repo sync jobs
  - API boundaries
  - background processing
  - audit/history

Trying to evolve this repo directly into the SaaS would mix two products with different lifecycles and make both harder to ship.

## Best Split

### Keep In This Repo

- VS Code extension commands and UI
- local workspace onboarding flow
- `.vscode/ai-context.json` compatibility
- editor-first prompt-copy workflow
- extension packaging and Marketplace assets

### Move Or Recreate In The SaaS Repo

- hosted project model
- user accounts and organizations
- durable server-side storage for project memory docs
- repo connection and sync jobs
- web UI for reviewing memory, handoffs, and snapshots
- background generation pipeline
- billing and plan enforcement

### Candidate Shared Core Later

Do not extract this first. Prove the SaaS shape first, then extract only what both products truly need:

- doc role model:
  - `project-brief`
  - `current-work`
  - `decisions`
  - `project-memory-snapshot`
- snapshot formatting rules
- handoff summary heuristics
- decision-signal detection
- README review heuristics

## Suggested SaaS Architecture

Assumption: the fastest path is a web app plus API in one codebase.

Recommended starting stack:

- Next.js
- TypeScript
- PostgreSQL
- Prisma
- NextAuth or Clerk
- Stripe
- background jobs later via Trigger.dev, Inngest, or a queue

Why this stack:

- fast to prototype
- easy to host
- good fit for dashboard + API + auth
- easy to add repo ingestion and async jobs later

## Repo Strategy

Use one of these two options.

### Option 1: Separate Repos

Recommended.

- `ai-session-kit`:
  the VS Code extension
- `project-memory-saas`:
  the hosted product

This keeps release cadence, package tooling, and product messaging clean.

### Option 2: New Monorepo

Only choose this if you already know you want shared packages very soon.

Example layout:

- `apps/extension`
- `apps/web`
- `packages/core`

This can work, but it adds coordination overhead earlier than you likely need.

## Recommended First Build Scope

Do not start by rebuilding every extension feature.

Start with:

1. Create a hosted project.
2. Store the four memory docs per project.
3. Render a handoff review page.
4. Allow manual editing of docs.
5. Add repo metadata and a simple snapshot.
6. Add session history later.
7. Add AI-assisted suggestions only after the data model feels right.

That sequence preserves the current philosophy:

- human docs are truth
- generated output is assistive
- heuristics should stay conservative

## Bootstrap Commands For A New SaaS Repo

### Create The Repo

```bash
mkdir -p ~/repos
cd ~/repos
npx create-next-app@latest project-memory-saas --typescript --eslint --app --src-dir --use-npm
cd project-memory-saas
git init
git add .
git commit -m "chore: initialize SaaS app"
```

### Add Core Dependencies

```bash
npm install @prisma/client zod
npm install next-auth
npm install stripe
npm install @tanstack/react-query
npm install react-hook-form
npm install date-fns
npm install clsx
npm install -D prisma
```

If you prefer Clerk instead of NextAuth:

```bash
npm install @clerk/nextjs
```

### Initialize Prisma

```bash
npx prisma init
```

### Suggested Early Folder Structure

```bash
mkdir -p docs
mkdir -p src/lib
mkdir -p src/lib/project-memory
mkdir -p src/lib/github
mkdir -p src/app/(app)
mkdir -p src/app/api
mkdir -p src/components/project-memory
```

## Docs To Bring Over First

Copy these as product-thinking references, not as live SaaS docs:

- `docs/project-brief.md`
- `docs/current-work.md`
- `docs/decisions.md`
- `README.md`

Suggested commands from this repo root:

```bash
mkdir -p ../project-memory-saas/docs/reference/ai-session-kit
cp docs/project-brief.md ../project-memory-saas/docs/reference/ai-session-kit/
cp docs/current-work.md ../project-memory-saas/docs/reference/ai-session-kit/
cp docs/decisions.md ../project-memory-saas/docs/reference/ai-session-kit/
cp README.md ../project-memory-saas/docs/reference/ai-session-kit/README-source.md
```

Why copy them this way:

- they preserve product intent
- they avoid confusing the new SaaS repo's own working docs
- they make it easier to selectively port language and decisions

## Code To Reuse Carefully

Do not copy `src/extension.js` wholesale into the SaaS.

Instead, selectively extract or rewrite logic from these areas:

- doc-role defaults
- snapshot generation rules
- git diff parsing heuristics
- session summary structure
- decision-signal detection
- README review detection

Treat the current implementation as a behavior reference, not a deployable backend module.

## Safe Code Import Path

If you want to experiment by copying logic first, use this path:

1. Create a new file in the SaaS repo:
   `src/lib/project-memory/legacy-reference.ts`
2. Port only pure functions.
3. Strip all `vscode` dependencies immediately.
4. Replace direct filesystem writes with returned data structures.
5. Add tests before using the ported logic in production flows.

## Example Commands To Bring Over A Starter Core

From this repo root:

```bash
mkdir -p ../project-memory-saas/docs/reference/ai-session-kit
cp src/extension.js ../project-memory-saas/docs/reference/ai-session-kit/extension-reference.js
```

Then in the SaaS repo:

```bash
mkdir -p src/lib/project-memory
touch src/lib/project-memory/docRoles.ts
touch src/lib/project-memory/snapshot.ts
touch src/lib/project-memory/handoff.ts
touch src/lib/project-memory/decisions.ts
touch src/lib/project-memory/readmeReview.ts
```

This keeps the original extension file available for reference without pretending it is already shared core.

## Early Data Model Suggestion

Start simple.

### Project

- `id`
- `name`
- `slug`
- `repoUrl`
- `defaultBranch`
- `createdAt`
- `updatedAt`

### ProjectDoc

- `id`
- `projectId`
- `role`
- `path`
- `content`
- `source`
- `updatedAt`

### Snapshot

- `id`
- `projectId`
- `branch`
- `summaryJson`
- `createdAt`

### Handoff

- `id`
- `projectId`
- `title`
- `whatChanged`
- `whyChanged`
- `preserveRules`
- `nextBestTask`
- `createdAt`

## Good Near-Term Product Shape

The extension and SaaS can reinforce each other:

- the extension stays the fastest way to work inside a repo
- the SaaS becomes the durable home for project memory across sessions and teammates
- later, the extension can sync selected docs to the SaaS instead of replacing local files

That is a cleaner story than forcing one codebase to be both an editor plugin and a hosted collaboration platform.

## Suggested Next Steps

1. Create the new SaaS repo with the commands above.
2. Copy the reference docs from this repo.
3. Write the SaaS repo's own `README.md`, `docs/project-brief.md`, and `docs/decisions.md`.
4. Build the hosted data model for the four memory-doc roles.
5. Reimplement one small pure feature first:
   snapshot formatting or handoff summary generation.
6. Keep the extension separate until shared logic is clearly stable.

## Bottom Line

Reuse the ideas, language, doc model, and selected heuristics from `AI Session Kit`.

Do not reuse this repo itself as the SaaS application base.

Use a new repo for the hosted product, and treat this extension as the local workflow companion that helped discover the product in the first place.

## Can The SaaS Work Without The VS Code Extension

Yes.

In fact, the SaaS should be designed so it is useful even if the user never installs the extension.

That matters because:

- some users work in Cursor, Windsurf, Zed, JetBrains, or the terminal
- some users will want shared project memory for a team, not just editor-local workflows
- some users will only care about durable docs, handoffs, and onboarding

The extension can be a strong companion, but it should not be the only path to value.

## Alternative Ways To Keep AI Memory Fresh

If you do not rely on the VS Code extension, the SaaS can keep project memory fresh through other inputs.

### Manual In-App Review

The simplest baseline:

- users edit `project-brief`, `current-work`, and `decisions` directly in the web app
- the SaaS generates or refreshes only the snapshot-style telemetry
- the app asks for a lightweight handoff review at the end of meaningful work

This is the lowest-risk starting point because it preserves the current product philosophy:

- human-maintained docs are truth
- generated content is suggestive, not authoritative

### GitHub App Or Repo Sync

The SaaS can connect to GitHub and derive memory refresh candidates from:

- changed files
- pull requests
- commit messages
- merged branches
- release tags

This is one of the strongest non-extension paths because it works across editors.

Good first use cases:

- draft a new handoff after a PR is merged
- suggest updates to `decisions` when decision-like commit messages appear
- refresh the project snapshot after material repo changes

### CLI Or Git Hook Workflow

You can also support users who prefer terminal-first workflows.

Examples:

- a CLI command like `project-memory handoff`
- a git hook that reminds the user to review handoff docs before commit or branch switch
- a CI step that flags stale project-memory docs

This can deliver much of the extension value without requiring editor integration.

### PR Review Workflow

Another strong path:

- the SaaS comments on or summarizes pull requests
- it suggests what changed, why it changed, and what future work should preserve
- a user approves or edits the suggested memory update in the web UI

This keeps memory updates attached to team workflows people already use.

### Chat Paste-In Workflow

Even a lightweight copy/paste loop can work:

- the SaaS provides a start-session prompt
- the user pastes it into their AI tool of choice
- the SaaS later provides a finish-session checklist and handoff form

This is less automated, but still cross-tool and consistent with the current product philosophy.

## Recommended SaaS-Only Baseline

If you want the SaaS to stand on its own before building integrations, start here:

1. Hosted docs for the four memory roles.
2. Manual handoff entry and review.
3. Repo metadata import.
4. GitHub-based snapshot refresh suggestions.
5. Session history and change history.

That is enough to prove whether users want durable project memory independent of editor plugins.

## If The Extension Becomes A Companion To The SaaS

This is a strong long-term model:

- SaaS:
  the canonical shared memory and team-facing history
- extension:
  the fastest in-editor capture and review surface

In that model, the extension should not become the source of truth for product behavior.

Instead, both products should share a small contract.

## What Must Stay In Sync Feature-Wise

Do not try to keep every implementation detail mirrored.

Keep these things aligned:

- doc roles and their meaning
- default doc paths where relevant
- prompt structure and handoff section names
- snapshot schema and field meanings
- decision-detection rules at a behavior level
- README review recommendation rules at a behavior level
- terminology shown to users

In other words:

- sync the contract
- allow the UX to differ

The extension UI and the web UI do not need to behave identically, but they should produce compatible outputs.

## Best Way To Prevent Product Drift

Create a shared specification before creating a shared package.

Recommended docs for the SaaS repo or a future shared repo:

- `docs/contracts/project-memory-doc-roles.md`
- `docs/contracts/handoff-format.md`
- `docs/contracts/snapshot-schema.md`
- `docs/contracts/readme-review-rules.md`

Those docs should define:

- required sections
- optional sections
- field meanings
- what is machine-generated versus human-maintained
- what counts as conservative behavior

That gives both projects a stable product contract even if the code lives separately.

## When To Extract Shared Code

Only extract shared code after both products clearly need the same pure logic.

Good candidates:

- markdown section builders
- doc role constants
- handoff formatting helpers
- snapshot schema validators
- heuristic utilities that do not depend on VS Code APIs

Bad candidates too early:

- filesystem flows
- editor interactions
- web API handlers
- auth-aware project loaders

## Multi-Project Testing You Will Need

If the SaaS and extension evolve together, you should expect three layers of testing.

### 1. Contract Tests

These verify that both products still agree on the shared meaning of project memory.

Examples:

- both recognize the same doc roles
- both produce the same required handoff sections
- both parse or render the same snapshot schema
- both preserve machine-managed sections correctly

These are the highest-value tests for keeping the products aligned.

### 2. Product-Specific Tests

Each codebase still needs its own local tests.

For the extension:

- doc initialization
- snapshot refresh
- handoff generation
- append-to-doc flows
- validation heuristics

For the SaaS:

- auth and permissions
- project creation
- doc editing
- snapshot creation jobs
- handoff history
- sync conflict handling

### 3. Cross-Product Integration Tests

These verify the real paired workflow.

Examples:

- extension creates local docs, SaaS imports them correctly
- SaaS updates shared memory, extension can pull or display the latest compatible shape
- both products render equivalent handoff sections from the same repo input
- a snapshot produced by one side is accepted by the other

These do not need to be huge at first, but you do need some.

## Minimum Viable Cross-Product Test Matrix

If you pair the extension with the SaaS, test these scenarios:

1. New project created in SaaS, then connected locally through the extension.
2. New project initialized locally in the extension, then imported into the SaaS.
3. Handoff written in the extension, then viewed and edited in the SaaS.
4. Handoff edited in the SaaS, then pulled or reconciled locally.
5. Snapshot refreshed from GitHub activity without the extension.
6. README review recommendation triggered in both products from similar repo changes.
7. Branch-switch or stale-memory warnings still make sense after sync.
8. Missing-doc recovery behaves safely in both products.

## Sync Model Recommendation

If you eventually sync local docs with the SaaS, choose a simple model first.

Recommended order:

1. Import/export first.
2. One-way sync second.
3. Two-way sync last.

Why:

- import/export is easy to reason about
- one-way sync limits conflicts
- two-way sync creates conflict resolution problems immediately

Good first sync directions:

- import local docs into SaaS
- export canonical SaaS docs back to disk on demand

Avoid real-time bidirectional sync early unless that is the core product.

## Conflict Strategy

If both products can edit memory docs, define conflict rules early.

At minimum decide:

- whether SaaS or local docs are canonical
- whether sync is push, pull, or manual merge
- how to detect stale versions
- whether machine-generated snapshot sections can overwrite each other
- how to show diff/review before applying changes

Without this, the paired experience will feel unreliable quickly.

## Practical Recommendation

Build the SaaS so it is valuable without the extension.

Then treat the extension as:

- a power-user capture tool
- a local review surface
- an optional sync client

That sequencing keeps the SaaS broadly useful and reduces the risk that product success depends on one editor integration.

If both products remain active, invest in:

- shared contracts
- contract tests
- a small cross-product integration suite

That is the cleanest way to keep them aligned without forcing both into one codebase.
