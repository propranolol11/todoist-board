# Todoist Board

Todoist Board is an Obsidian plugin that displays Todoist tasks as interactive boards in the sidebar or directly inside notes.

## Features

- Sidebar board for quickly reviewing and managing Todoist tasks.
- Inline `todoist-board` code blocks for embedding filtered task lists in notes.
- Todoist filter support, including project, priority, date, and custom filter queries.
- Task actions for adding, editing, completing, deleting, scheduling, deferring, moving, and changing priority.
- Command palette capture with `Todoist Board: Add Task` and recurring schedules in the task sheet's **Repeats** field.
- Parent and subtask display with collapse controls.
- Sorting, compact mode, hidden tasks, manual order, polling refresh, and cached offline display.
- Mobile support is enabled with `isDesktopOnly: false`.
- 
## Screenshots

![Todoist Board sidebar view](https://github.com/user-attachments/assets/6a9f23ae-98cb-4f6e-8624-5c03fa9579ef)

![Todoist Board inline task list](https://github.com/user-attachments/assets/8031cdab-ade9-4e8a-963f-cc946fe5561d)

![Todoist Board task controls](https://github.com/user-attachments/assets/6cc0ad33-8e6d-48e0-911f-863bde8d7fa5)

![Todoist Board mobile layout](https://github.com/user-attachments/assets/41e8ff5d-caf4-414d-816f-dbfcceafebb5)

## Setup

Todoist Board requires Obsidian 1.8.7 or newer. Obsidian 1.11.4 or newer is recommended for Secret Storage support.

On Obsidian 1.13.0 or newer, plugin settings are also available in Obsidian's settings search.

1. Install the plugin in Obsidian.
2. Open Obsidian settings and go to Todoist Board.
3. Paste a Todoist personal API token.
4. Choose the filters you want available in the sidebar board.
5. Open the command palette and run `Open Todoist Board`.

You can create a Todoist personal API token from Todoist account settings.
Existing plugin-data tokens are migrated to Obsidian Secret Storage automatically when Secret Storage is available.

Use **Repeats** when adding or editing a task for schedules such as `every day`, `every Monday at 9am`, or `every! 2 weeks`. A selected date starts a new repeat schedule from that date; an explicit start date in the repeat text takes precedence. Changing only the date of an existing repeating task moves its next occurrence while preserving the schedule. Clear **Repeats** to make the task a one-time task.

## Inline Boards

Add a code block to any note:

````markdown
```todoist-board
filter: today
```
````

Useful filter examples:

| Filter query | Result |
| --- | --- |
| `filter: today` | Tasks due today |
| `filter: #ProjectName` | Tasks in a Todoist project |
| `filter: p1` | Priority 1 tasks |
| `filter: today & (p1 \| p2)` | Tasks due today with priority 1 or 2 |
| `filter: created after: -7 days` | Tasks created in the last seven days |
| `filter: view all` | All active tasks |
| `filter: due after: today & due before: in 8 days` | Upcoming tasks for the next week |

Todoist's filter syntax is documented in the Todoist help center.

## Mobile Notes

Todoist Board avoids desktop-only Electron, Node, and filesystem APIs. Network requests use Obsidian's `requestUrl` API so the plugin can run on desktop and mobile. Mobile layouts are designed for touch use, including task sheets and long-press interactions.

## Troubleshooting

- If no tasks appear, confirm that the Todoist API token is present and valid.
- If a filter looks empty, test the same query in Todoist and check project names, labels, dates, and priority syntax.
- If Todoist is unavailable, the plugin may show cached tasks until the next successful sync.
- If inline boards do not update, switch notes or run a manual sync from the sidebar board.
- If mobile behavior feels off, update Obsidian and the plugin, then reload the vault.

## Development

```bash
npm install
npm run typecheck
npm run lint:obsidian
npm test
npm run build
npm audit
```

Run all release checks with:

```bash
npm run verify
```


### Disclosures

- Requires a Todoist account and a Todoist personal API token.
- Connects to the Todoist REST and Sync APIs to fetch, create, update, schedule, move, and complete tasks.
- Stores the Todoist API token with Obsidian Secret Storage when available, falling back to plugin data storage on older Obsidian versions.
- Stores non-secret plugin preferences locally with Obsidian's plugin data storage.
- Caches task snapshots, project metadata, label metadata, hidden-task state, sort mode, compact mode, and manual order locally for responsiveness and offline display.
- Does not collect analytics, use telemetry, or send data to any service other than Todoist.
- Includes an optional funding link in the plugin settings and manifest.
- External links to Todoist help, Obsidian documentation, GitHub, and Ko-fi open only when clicked.
- The settings Copy button writes the example `todoist-board` block to the clipboard when clicked. The plugin does not read clipboard contents.

This plugin is not affiliated with, endorsed by, or sponsored by Todoist.
