# Decisions

## Decision log
- Date: 2026-06-20
- Decision: Start with a zero-build plain JavaScript VS Code extension MVP.
- Context: The first goal is to validate the workflow quickly in local VS Code projects without adding TypeScript or packaging overhead.
- Consequences: The code is easy to run immediately, but type safety and test ergonomics are lighter than a full TypeScript setup.

## Decision log
- Date: 2026-06-20
- Decision: Use clipboard-based prompts instead of direct AI integrations.
- Context: The product value is the workflow habit and durable docs, not provider coupling.
- Consequences: The extension is broadly compatible, but users still need to paste prompts into their AI tool manually.

## Rejected options
- Building provider-specific API integrations as part of the MVP.
- Requiring prompt injection before every single AI message.
