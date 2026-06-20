# Refactor Roadmap

## Problem areas
- Prompt generation and filesystem logic currently live in one extension file.
- Status reporting is intentionally minimal.

## Planned improvements
- Split config, template, and prompt logic into smaller modules once the workflow settles.
- Add tests around config resolution and file creation behavior.
- Introduce a richer project-memory status view if users want more than the status bar.

## Sequencing
- Validate the MVP workflow with real projects first.
- Refactor after the command surface and config shape feel stable.

## Watchouts
- Avoid adding AI-provider-specific assumptions too early.
- Keep setup friction low so testing in other repos stays simple.
