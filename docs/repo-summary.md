# Repo Summary

## What this project is
- `codex-session-kit` is a VS Code extension project for durable AI session bootstrapping.
- It helps a repo define its purpose, architecture, active work, decisions, and planned refactors in stable markdown files.
- The extension is meant to work especially well with Codex prompts and session handoffs.

## Who it is for
- Developers using AI coding tools across longer-running repositories.
- Individuals or teams who want better continuity between AI-assisted coding sessions.

## Current goals
- Ship a small MVP that is easy to test locally in VS Code.
- Keep the first version focused on commands, templates, and configuration instead of AI provider integrations.

## How to work in this repo
- Treat the README as the product overview and user-facing explanation.
- Keep the extension lightweight and easy to run without a build step.
- Update the docs in `docs/` when product scope or behavior changes.

## Key links
- Local extension entry point: `src/extension.js`
- Workspace config: `.vscode/ai-context.json`
