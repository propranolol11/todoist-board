An [Obsidian](https://obsidian.md) plugin that brings your [Todoist](https://todoist.com) tasks into beautiful, interactive boards; right inside your notes.
## **How to Use**:
- ✌️ **Two board types**
    1. **Sidebar board** for quick access and overview. 
    2.  **Inline board** for embedding project or filtered task lists directly in a note.

- To open Todoist Board in the sidebar, do it via Command Palette
	- Cmd + P on Mac; type Todoist Board, you'll see command there.
	- Ctrl + P on Windows
- To embed a Todoist Board in a note, simply write:
````
```todoist-board
filter: any valid todoist filter (see examples below)
```
````

Some most commonly used filter to try are:
| Filter Query                                     | What it does                                                  |
|--------------------------------------------------|---------------------------------------------------------------|
| `filter: today`                                  | Shows tasks due today                                         |
| `filter: #projectname`                           | Shows tasks in that project                                   |
| `filter: p1`                                     | Shows P1 (high priority) tasks                                |
| `filter: today & (p1 \| p2)`                     | Tasks due today AND either P1 or P2 priority                  |
| `filter: created after: -7 days`                 | Tasks that were created in the last 7 days                   |
| `filter: view all`                               | Shows **all** your tasks                                      |
| `filter: due after: today & due before: in 8 days`| Upcoming tasks within the next week                          |

Also check this article from Todoist [24 Todoist Filters to Keep You Super Organized](https://www.todoist.com/inspiration/todoist-filters)

Supports both **inline boards** (embedded in notes) and a **dedicated sidebar board** for quick task management.

<img width="1584" height="1110" alt="CleanShot 2025-08-14 at 7  28 44@2x" src="https://github.com/user-attachments/assets/6a9f23ae-98cb-4f6e-8624-5c03fa9579ef" />

![CleanShot 2025-08-17 at 8  50 04](https://github.com/user-attachments/assets/8031cdab-ade9-4e8a-963f-cc946fe5561d)

![CleanShot 2025-08-17 at 8  37 03](https://github.com/user-attachments/assets/6cc0ad33-8e6d-48e0-911f-863bde8d7fa5)

![CleanShot 2025-08-17 at 8  41 39](https://github.com/user-attachments/assets/41e8ff5d-caf4-414d-816f-dbfcceafebb5)


