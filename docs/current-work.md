# Current Work

## Active Work
- Rebranding the extension from Codex Session Kit to AI Session Kit.
- Repositioning the extension around handoff quality and documentation usefulness instead of multi-doc auto-generated memory.
- Updating public product copy across the README, package manifest, onboarding docs, and Marketplace guidance to match the new AI Session Kit positioning.
- Replacing the generic extension artwork with a dedicated AI Session Kit sidebar icon plus matching Marketplace/doc preview assets.
- Updating initialization so new repos get honest starter docs plus one generated snapshot.
- Converting the update flow into a review step that suggests what the human docs and README should say next.
- Improving session handoffs so they capture what changed, why, what to preserve, and what to do next.

## Next Best Task
- Rename the GitHub repo and local workspace folder to `ai-session-kit` once the new branding is settled.
- Set a real VS Code Marketplace publisher in `package.json` and add a root `CHANGELOG.md` so publish preflight can pass cleanly.
- Test the new commands in an Extension Development Host against a real repo.
- Decide whether the review flow should eventually support a guided README update, not just a recommendation.
- Add automated coverage around doc initialization, snapshot refresh, and handoff-generation heuristics.

## Risks Or Watchouts
- `src/extension.js` is still carrying most of the workflow logic.
- Validation and README-review heuristics can still produce false positives.
- Public branding now says AI Session Kit, but internal command ids, config keys, and snapshot markers still use the legacy `codexSessionKit` naming for compatibility.
- The repo still contains older docs from the previous model, so local testing should focus on the new tracked docs in `.vscode/ai-context.json`.
