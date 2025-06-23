This started off as a small code snippet I made to fill a gap in my workflow has now, after few hundred hours, grown into this custom task manager that I think you might like.

Introducing 🥁... Todoist Board!

# Main Features

### Runs locally and syncs silently in the background
![01](https://github.com/user-attachments/assets/4dbf0933-200a-4fe5-b40e-c0997c0bd3a6)
_see how quick that typo synced across_

This was one of the core ideas of the plugin. It always reads tasks from localStorage, and refreshes in the background, and when it writes changes, it writes simultaneous to localStorage (which renders immediately giving the native feel) whilst syncing the changes in the background.


### Two-way sync! (add/edit/complete tasks)
![02](https://github.com/user-attachments/assets/a5666f4f-c06e-4738-8035-1e17e6ec94f4)


### Compact mode with side colors matching the project colors
![03](https://github.com/user-attachments/assets/f2c0750e-b1a8-4161-aadc-9e5562d5c344)
![04](https://github.com/user-attachments/assets/123a8679-2e44-40a8-bee7-0b8e68672a3d)

**And when you want to see the full details whilst in compact mode, click on the task.**
![05](https://github.com/user-attachments/assets/6d061fed-61a0-433a-beed-fd298665d04f)

***
### Quick actions (Today / Tomorrow / Edit / Delete) appear on selection
![06](https://github.com/user-attachments/assets/e4a7c1d5-5e70-4416-8b0e-4c07dddd5564)


### Manual sort with drag & drop – remembers your order across sessions!
![07](https://github.com/user-attachments/assets/24419c9b-9479-4ae2-b0cc-7a2ddc1346a9)
![07b](https://github.com/user-attachments/assets/60b53517-b811-4acd-9c5e-76d4b2403492)
_notice how I quit Obsidian completely and relaunch; same order_


### Focus mode (Queue view)
shows one task at a time, like a tunnel vision mode. Inspired by Sequential projects in Omnifocus.
![08](https://github.com/user-attachments/assets/df49d466-0cd2-4b6f-ac5e-1aa417912728)


### Add custom filters and pick one to load by default!
![09](https://github.com/user-attachments/assets/c3d5a146-77bb-441a-8ffd-83fc664fa7d0)

![9b](https://github.com/user-attachments/assets/c6ee247a-0f90-4fb9-814b-bd62545013db)
_and this is setting a filter view as the default view_


### Add Task and Edit Task modals
clean and minimal (they're still lacking, will focus on their polishing next few updates)
![10](https://github.com/user-attachments/assets/eda60564-c6da-4def-99f3-f21623a491a4)
  
### Visual sync indicator
in the bottom right of tasks (orange dot = unsynced changes)
![12](https://github.com/user-attachments/assets/a4ddec0a-62f2-4662-bcf8-5e97df25d49c)


### Non-tasks
(lines starting with *) are styled like notes/sections (with custom styling coming some time in the future)
![14](https://github.com/user-attachments/assets/0fcb4154-d257-4d15-bc3e-213820d17e1a)
_best usecase I found for it is This Evening section inspired by Things 3 app; I'm most likely to to turn 'This Evening' into a core feature tbh_


### Subtasks are grouped neatly under parents
![15](https://github.com/user-attachments/assets/fa119774-fc99-46db-b8db-ebe7095a81bb)
_imo is better than how Todoist handles subtasks currently; Subtasks functionalities are still evolving in this plugin_

## Beautiful in both Dark mode and Light mode
<img width="661" alt="image" src="https://github.com/user-attachments/assets/ff3653e7-3154-4d5b-9570-9be30a48b712" />
<img width="659" alt="image" src="https://github.com/user-attachments/assets/f32fe344-9554-426d-9192-004d9bb185d7" />

