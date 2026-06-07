# Contributing

Thanks for helping improve Todoist Board.

## Report Bugs

Open a GitHub issue with:

- Obsidian version and platform
- Todoist Board version
- Steps to reproduce
- Screenshots or console errors when useful

## Development

```bash
npm install
npm run typecheck
npm run lint:obsidian:errors
npm test
npm run build
```

Keep changes focused and include tests for task sorting, storage, Todoist payloads, or hierarchy behavior when those areas change.

## Releases

Obsidian release tags must match `manifest.json.version` exactly. Release assets should include `main.js`, `manifest.json`, and `styles.css`.
