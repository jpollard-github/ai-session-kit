# Architecture

## System shape
- This repo currently contains a single VS Code extension implemented in plain CommonJS JavaScript.
- The extension activates from command usage and manages project-memory docs in the active workspace.

## Important directories
- `src/` contains the extension activation and command logic.
- `docs/` contains the durable project-memory files that the extension encourages other repos to maintain.
- `.vscode/ai-context.json` defines which project-memory docs are considered the source of truth for prompts.

## Runtime flow
- A user runs a command from the command palette.
- The extension resolves the primary workspace folder, reads `.vscode/ai-context.json` when present, and derives the configured memory files.
- The initialize command creates any missing docs and starter templates.
- The start and finish commands build prompt text and copy it to the clipboard.
- The status command and status bar summarize which docs are present.

## Integration points
- VS Code command registration
- VS Code clipboard API
- VS Code status bar API
- Workspace filesystem via Node `fs`

## Constraints
- This MVP does not integrate directly with Codex or any other AI provider API.
- Session boundaries are intentionally human-defined rather than automatically detected.
- The current implementation assumes the first workspace folder is the active project root.
