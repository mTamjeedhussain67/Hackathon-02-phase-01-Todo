# Todo Console App

A simple command-line todo application with in-memory storage and a numbered menu interface.

## Features

- Add, view, update, and delete tasks
- Mark tasks as complete
- Pure Python standard library (no external dependencies)
- Simple numbered menu selection (1-7)

## Running

```bash
python main.py
```

## Menu Options

| Option | Action |
|--------|--------|
| 1 | Add Task - Create a new todo item |
| 2 | Delete Task - Remove a task from the list |
| 3 | Update Task - Modify an existing task description |
| 4 | View Task List - Display all tasks |
| 5 | Mark as Complete - Toggle task completion status |
| 6 | Help / Show Menu - Display the menu |
| 7 | Exit - Close the application |

## Example Session

```
==================================================
TODO APP - Phase I
==================================================
Select an option:
  1. Add Task
  2. Delete Task
  3. Update Task
  4. View Task List
  5. Mark as Complete
  6. Help / Show Menu
  7. Exit
==================================================

Select option (1-7): 1
Enter task description: Buy Groceries
✓ Task added: [1] Buy Groceries

Select option (1-7): 4

Task List:
--------------------------------------------------
[1] Buy Groceries
--------------------------------------------------

Select option (1-7): 5
Enter task ID to mark complete: 1
✓ Task marked complete: [1] Buy Groceries

Select option (1-7): 4

Task List:
--------------------------------------------------
[1] Buy Groceries ✓
--------------------------------------------------
```

## Development

Run linter:
```bash
ruff check .
```

Auto-fix issues:
```bash
ruff check --fix .
```

## Author

**Muhammad Tamjeed Hussain**
