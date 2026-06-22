# Getting Started

![AI Session Kit](../media/ai-session-kit.webp)

AI Session Kit is handoff-first. The goal is not to auto-write great docs from repo scans. The goal is to help you leave a short, accurate handoff that the next AI session can trust.

## Default Docs

- `docs/project-brief.md`
- `docs/current-work.md`
- `docs/decisions.md`
- `docs/project-memory-snapshot.md`

The first three are human notes. The snapshot is machine-generated repo telemetry.

The tracked doc roles come from `.vscode/ai-context.json`, which the extension initializes for you on first run.

## First Run

1. Open a real repository folder in VS Code.
2. Open the `AI Kit` sidebar.
3. Run `Initialize Handoff Docs`.
4. Confirm that `.vscode/ai-context.json` and the four default docs were created.
5. Fill in the human docs with the repo-specific context that code scanning cannot infer.
6. Leave `project-memory-snapshot.md` mostly machine-managed; use it as evidence, not as your source of truth.
7. Run `AI Session: Start Session From Handoff Docs` before a fresh AI conversation.

## Daily Workflow

1. Start the session with `AI Session: Start Session From Handoff Docs`.
2. Do the work.
3. Run `Prepare Handoff Review` to refresh the snapshot and inspect the working checklist.
4. Run `Generate Session Handoff` when you want the cleaner handoff draft.
5. Append or edit `current-work.md` and `decisions.md`.
6. If user-facing behavior changed materially, update `README.md` before you wrap up.
7. Run `AI Session: Finish Session And Update Handoff Docs` at the end.

## Review Vs Handoff

- `Prepare Handoff Review` is the checkpoint command.
  - It refreshes the machine snapshot first.
  - It is meant to help you decide what the handoff should say.
- `Generate Session Handoff` is the cleaner output.
  - It is meant to produce the concise summary you may want to keep, paste, or append.

## Compatibility Note

The visible product name is AI Session Kit, but some internal command ids and config keys still use `codexSessionKit` naming for compatibility. That is expected.

## What To Write

Good notes include:

- what changed and why
- what future edits should preserve
- what task should happen next
- architectural or workflow decisions that would be painful to rediscover

Less useful notes include:

- timestamps for their own sake
- full transcripts
- every small code change
- shallow repo telemetry that already exists in the snapshot
