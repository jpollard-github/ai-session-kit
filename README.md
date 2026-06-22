# AI Session Kit

AI Session Kit is a lightweight VS Code extension for AI-heavy coding workflows. Its job is simple:

> help you leave a short, accurate handoff and better project docs that future AI sessions can actually use.

The extension no longer tries to pretend shallow repo scans are durable documentation. Instead, it separates machine-generated repo telemetry from human-maintained handoff notes.

## What It Does

- `AI Session: Initialize Handoff Docs`
  - Creates `.vscode/ai-context.json` if it does not exist.
  - Creates a lean default doc set:
    - `docs/project-brief.md`
    - `docs/current-work.md`
    - `docs/decisions.md`
    - `docs/project-memory-snapshot.md`
  - Fills only the snapshot file automatically.
- `AI Session: Prepare Handoff Review`
  - Refreshes the machine-generated snapshot.
  - Opens a working review/checklist document with:
    - what changed
    - likely files to review
    - candidate notes worth confirming
    - questions to answer before writing the final handoff
    - README review suggestions when user-facing behavior likely changed
- `AI Session: Generate Session Handoff`
  - Creates the cleaner, reusable handoff draft from git status, recent commits, decision-like signals, and TODO-style additions.
  - Can append suggested notes into `current-work.md` and `decisions.md`.
  - Can prompt you to review `README.md` when changes look material to users.
- `AI Session: Validate Memory Docs`
  - Checks whether the tracked docs still look usable.
  - Flags missing docs, starter-template docs, malformed snapshot sections, branch-switch drift, and likely review gaps.
- `AI Session: Start Session From Handoff Docs`
  - Copies a prompt that tells your next AI session to read the tracked docs first.
- `AI Session: Finish Session And Update Handoff Docs`
  - Copies a finish prompt that explicitly asks for a concise handoff.
  - Prompts you to review `README.md` when current repo signals suggest user-facing changes.

## Default Files

By default the extension tracks:

- `docs/project-brief.md`
- `docs/current-work.md`
- `docs/decisions.md`
- `docs/project-memory-snapshot.md`

The first three are human-maintained. The snapshot is machine-generated telemetry.

## Why This Shape

The old version generated “smart” content into multiple docs, but most of that output was really repo telemetry:

- changed files
- branches
- recent files
- package metadata
- open editors

That information is still useful, but it should not masquerade as architecture or current-work truth.

The new workflow is handoff-first:

1. Read the docs before a fresh AI session.
2. Do the work.
3. Run `Prepare Handoff Review` to refresh the snapshot and sanity-check what changed.
4. Run `Generate Session Handoff` when you want the cleaner summary to keep, paste, or append.
5. Save the durable human notes that future-you and future AI sessions will actually care about.

## Which Command To Use

- Use `AI Session: Prepare Handoff Review` when you want a checkpoint.
  - It refreshes the machine snapshot first.
  - It is better for asking “what should I capture?” than for producing the final wording.
- Use `AI Session: Generate Session Handoff` when you want the final draft.
  - It does not exist mainly to refresh telemetry.
  - It is better for a reusable summary you might paste into a future AI session or append into `current-work.md`.

## Example Start Prompt

```text
Before doing anything, read:
- docs/project-brief.md (project-brief)
- docs/current-work.md (current-work)
- docs/decisions.md (decisions)
- docs/project-memory-snapshot.md (project-memory-snapshot)
Use those as the primary source of truth. Only inspect implementation files when needed.

Use the doc roles to prioritize what to read closely and which files to update later.
```

## Example Finish Prompt

```text
Review the changes made in this session.
Before updating the memory docs, scan the current folder for changed, added, or deleted files, including files that may have been modified manually outside this chat session.
Write or update a concise handoff so future AI sessions understand what changed, why it changed, what to preserve, and what to do next.
Relevant project memory files: docs/project-brief.md, docs/current-work.md, docs/decisions.md, docs/project-memory-snapshot.md.
Incorporate meaningful repo changes from both this chat session and any manual edits discovered during the folder scan.
Only update the files that changed meaningfully.
If the repo has a README.md and user-facing behavior changed materially, update the README too.
```

## What “Useful” Means

This extension is useful when it helps with at least one of these:

- A fresh AI thread starts smarter.
- Your assistant makes fewer repo-specific mistakes.
- Future-you re-enters the repo faster.

If it only refreshes files and timestamps, it is not doing its job.

## Local Development

- `npm run lint:extension`
- `npm run publish:check`
- `npm run package:vsix`
  - Writes the built extension to `vsix/` so it is easy to find in Finder when installing locally.

## Current Limitations

- No automated tests yet.
- Validation is heuristic.
- Multi-root workspaces still use the first folder only.
- Commit suggestions are intentionally conservative and may be omitted when the session theme is unclear.
