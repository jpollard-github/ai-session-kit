# Codex Session Kit

Codex Session Kit is a lightweight VS Code extension for AI-heavy coding workflows. It gives each repository a small set of durable project-memory docs, then makes it easy to start an AI session by reading them first and finish a session by updating them.

The core habit it enforces is simple:

> AI should consume durable project context first, then update that context before leaving.

## What It Does

This MVP focuses on local workflow support, not API integrations.

- `AI: Initialize Project Memory Docs`
  - Creates `.vscode/ai-context.json` if it does not exist.
  - Creates any missing project-memory docs without overwriting existing ones.
- `AI: Start Session From Project Memory`
  - Copies a reusable “read these docs first” prompt to the clipboard.
- `AI: Finish Session And Update Project Memory`
  - Copies a reusable “update project memory before leaving” prompt to the clipboard.
- `AI: Show Project Memory Status`
  - Opens a quick status document showing which configured memory files exist.
- Status bar indicator
  - Shows how many configured memory files exist in the current workspace.

## Default Files

By default the extension manages:

- `docs/repo-summary.md`
- `docs/architecture.md`
- `docs/current-work.md`
- `docs/refactor-roadmap.md`
- `docs/decisions.md`

## Workspace Config

The extension looks for `.vscode/ai-context.json` and uses it as the primary source of truth for which docs to read and maintain.

Example:

```json
{
  "docPaths": [
    "docs/repo-summary.md",
    "docs/architecture.md",
    "docs/current-work.md",
    "docs/refactor-roadmap.md",
    "docs/decisions.md"
  ]
}
```

If that file does not exist, the extension falls back to the `codexSessionKit.docPaths` setting in VS Code.

## Start-Session Prompt

The start command copies a prompt shaped like this:

```text
Before doing anything, read:
- docs/repo-summary.md
- docs/architecture.md
- docs/current-work.md
- docs/refactor-roadmap.md
- docs/decisions.md
Use those as the primary source of truth. Only inspect implementation files when needed.
```

## Finish-Session Prompt

The finish command copies a prompt shaped like this:

```text
Review the changes made in this session.
Update the relevant docs in /docs so future AI sessions understand the current state, architecture, decisions, and next work.
Relevant project memory files: docs/repo-summary.md, docs/architecture.md, docs/current-work.md, docs/refactor-roadmap.md, docs/decisions.md.
Only update the files that changed meaningfully during this session.
```

## Do You Need To Run These Every Prompt?

Usually no.

For most AI tools, the start-session prompt should be used once at the beginning of a working conversation, not before every single follow-up prompt. After the model has loaded that context, you can keep working inside the same thread until something important changes.

The finish-session prompt should usually be used once near the end of the conversation, or any time you want to hand the project back to your future self or another AI session in a clean state.

## What Counts As The Same Session?

The extension does not try to detect Codex, Copilot, Claude, or Cursor session boundaries directly. In practice, treat it as the same session if you are still in the same uninterrupted AI conversation and the assistant still has the working context loaded.

You should run the start-session prompt again when:

- You open a new chat or thread.
- You switch to a different AI tool.
- The model loses context or starts behaving like it has not read the project docs.
- You come back after enough time that the conversation context is no longer trustworthy.
- You switch to a materially different task, branch, or architectural area.

If you are unsure, rerunning the start-session prompt is cheap and usually worth it.

## Good Fit

This is especially useful for:

- Long-running personal projects
- Client work
- AI-assisted development workflows
- Repos with lots of context
- Projects you revisit after weeks or months
- Teams using Codex, Copilot, Claude, Cursor-style tools

It is usually less useful for:

- Tiny scripts
- Throwaway experiments
- Simple libraries
- Repos that already have excellent durable docs

## How To Test Locally

1. Open this repo in VS Code.
2. Press `F5` to launch an Extension Development Host.
3. In the new window, open a test repository.
4. Run `AI: Initialize Project Memory Docs`.
5. Run `AI: Start Session From Project Memory` and paste the copied prompt into your AI tool.
6. Run `AI: Finish Session And Update Project Memory` when you want the AI to refresh the docs.

## Roadmap Ideas

- Track “last refreshed” timestamps for memory docs.
- Add a dedicated side panel instead of a status document.
- Support alternate prompt templates for different AI tools.
- Offer optional insertion into an editor instead of clipboard-only behavior.
- Add repo-level commands for validating stale or missing memory files.
