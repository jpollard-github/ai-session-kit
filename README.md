# AI Session Kit

This project is being canned.

I am not planning to keep building `ai-session-kit` as a VS Code extension, and this repository should be treated as archived unless that changes later.

## Why

After working on it more, the useful part turned out not to be the extension itself.

What actually felt valuable was:

- reusable prompts for starting and finishing AI coding sessions
- a small set of durable project docs worth reviewing later
- better handoff context for fresh AI threads

What did not feel worth continuing:

- VS Code command workflow overhead
- machine-generated "memory" docs as a product
- claims about token or cost savings
- extra ceremony around maintaining the tool itself

In practice, the packaging became heavier than the product.

## Recommendation

Instead of continuing this extension, I’d extract the best ideas into something much smaller and easier to inspect, such as:

- `PROMPTS.md`
- a tiny "AI Project Prompts" repo
- a lightweight "Repo Handoff Prompts" document

Useful prompt ideas:

- `Update README.md from current repo state`
- `Update TODO.md from recent work`
- `Create AI handoff from README + TODO + git diff`
- `Review docs for stale or misleading claims`
- `Summarize next actions for a new AI coding session`

## What Still Seems True

The underlying lesson still feels solid:

- fresh AI sessions benefit from a handoff
- durable docs can help when they are short and genuinely maintained
- human-written context matters more than auto-generated repo telemetry

## Status

- No further extension development is planned.
- This repo remains as an artifact of the idea and its product exploration.
- If the concept continues anywhere, it will likely be in a much smaller prompt-first form rather than as an editor extension.
