# Quickstart: Phase I In-Memory Python Console Todo App

**Feature**: 001-todo-console-app
**Date**: 2026-01-02

## Prerequisites

- **Python**: Version 3.13 or higher
- **UV**: Latest version (package manager) - [Install UV](https://github.com/astral-sh/uv?tab=readme-ov-file#installing)
- **OS**: Linux, macOS, or Windows with Python support

## Installation

### 1. Install UV (if not already installed)

```bash
# On Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or with pip (not recommended)
pip install uv
```

### 2. Initialize the Project

```bash
# Create new project
uv init todo-app

# Navigate into project directory
cd todo-app
```

### 3. Add Development Dependencies

```bash
# Add ruff for PEP8 linting
uv add --dev ruff
```

### 4. Create Project Files

Create the following files in your project directory:

#### `models.py`
```python
from dataclasses import dataclass

@dataclass
class Task:
    """Represents a single todo item."""
    id: int
    title: str
    completed: bool = False
```

#### `todo_manager.py`
```python
from typing import List, Optional
from models import Task


class TodoManager:
    """Manages in-memory storage and operations for Todo tasks."""

    def __init__(self) -> None:
        """Initialize an empty task list."""
        self._tasks: List[Task] = []
        self._next_id: int = 1

    def add_task(self, title: str) -> Task:
        """Add a new task with the given title."""
        if not title or not title.strip():
            raise ValueError("Task description cannot be empty")
        if len(title) > 500:
            raise ValueError("Task description too long (max 500 characters)")

        task = Task(id=self._next_id, title=title.strip(), completed=False)
        self._tasks.append(task)
        self._next_id += 1
        return task

    def view_tasks(self) -> List[Task]:
        """Return all tasks in storage order."""
        return self._tasks.copy()

    def update_task(self, task_id: int, new_title: str) -> Task:
        """Update the title of an existing task."""
        task = self.find_task(task_id)
        if task is None:
            raise ValueError(f"Task with ID {task_id} not found")
        if not new_title or not new_title.strip():
            raise ValueError("Task description cannot be empty")
        if len(new_title) > 500:
            raise ValueError("Task description too long (max 500 characters)")

        task.title = new_title.strip()
        return task

    def mark_complete(self, task_id: int) -> Task:
        """Mark a task as completed."""
        task = self.find_task(task_id)
        if task is None:
            raise ValueError(f"Task with ID {task_id} not found")

        task.completed = True
        return task

    def delete_task(self, task_id: int) -> None:
        """Delete a task by ID."""
        task = self.find_task(task_id)
        if task is None:
            raise ValueError(f"Task with ID {task_id} not found")

        self._tasks.remove(task)

    def find_task(self, task_id: int) -> Optional[Task]:
        """Find a task by ID, returning None if not found."""
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None
```

#### `main.py`
```python
#!/usr/bin/env python3
"""Console-based Todo application with in-memory storage."""

import sys
from todo_manager import TodoManager


class ConsoleUI:
    """Console user interface for Todo application."""

    def __init__(self) -> None:
        """Initialize the UI with a TodoManager."""
        self.manager = TodoManager()

    def show_menu(self) -> None:
        """Display the main menu."""
        print("\n" + "=" * 50)
        print("TODO APP - Phase I")
        print("=" * 50)
        print("Available commands:")
        print("  add <description>    - Add a new task")
        print("  view                 - View all tasks")
        print("  update <id> <title>  - Update task description")
        print("  complete <id>        - Mark task as complete")
        print("  delete <id>          - Delete a task")
        print("  help                 - Show this menu")
        print("  exit                 - Exit the application")
        print("=" * 50)

    def show_tasks(self) -> None:
        """Display all tasks."""
        tasks = self.manager.view_tasks()
        if not tasks:
            print("\nNo tasks available. Add a task to get started!")
            return

        print("\nTask List:")
        print("-" * 50)
        for task in tasks:
            status = " (COMPLETED)" if task.completed else ""
            print(f"[{task.id}] {task.title}{status}")
        print("-" * 50)

    def run(self) -> None:
        """Run the main application loop."""
        self.show_menu()

        while True:
            try:
                command = input("\n> ").strip()
                if not command:
                    continue

                parts = command.split(maxsplit=2)
                cmd = parts[0].lower()

                if cmd == "exit":
                    print("Goodbye!")
                    break

                elif cmd == "help":
                    self.show_menu()

                elif cmd == "add":
                    if len(parts) < 2:
                        print("Error: Please provide a task description")
                        print("Usage: add <description>")
                        continue
                    title = " ".join(parts[1:])
                    try:
                        task = self.manager.add_task(title)
                        print(f"✓ Task added: [{task.id}] {task.title}")
                    except ValueError as e:
                        print(f"Error: {e}")

                elif cmd == "view":
                    self.show_tasks()

                elif cmd == "update":
                    if len(parts) < 3:
                        print("Error: Please provide task ID and new description")
                        print("Usage: update <id> <new description>")
                        continue
                    try:
                        task_id = int(parts[1])
                        new_title = parts[2]
                        task = self.manager.update_task(task_id, new_title)
                        print(f"✓ Task updated: [{task.id}] {task.title}")
                    except ValueError as e:
                        print(f"Error: {e}")

                elif cmd == "complete":
                    if len(parts) < 2:
                        print("Error: Please provide task ID")
                        print("Usage: complete <id>")
                        continue
                    try:
                        task_id = int(parts[1])
                        task = self.manager.mark_complete(task_id)
                        print(f"✓ Task marked complete: [{task.id}] {task.title}")
                    except ValueError as e:
                        print(f"Error: {e}")

                elif cmd == "delete":
                    if len(parts) < 2:
                        print("Error: Please provide task ID")
                        print("Usage: delete <id>")
                        continue
                    try:
                        task_id = int(parts[1])
                        self.manager.delete_task(task_id)
                        print(f"✓ Task deleted: [{task_id}]")
                    except ValueError as e:
                        print(f"Error: {e}")

                else:
                    print(f"Error: Unknown command '{cmd}'")
                    print("Type 'help' for available commands")

            except KeyboardInterrupt:
                print("\nGoodbye!")
                sys.exit(0)
            except Exception as e:
                print(f"Unexpected error: {e}")


def main() -> None:
    """Entry point for the application."""
    ui = ConsoleUI()
    ui.run()


if __name__ == "__main__":
    main()
```

#### `README.md`
```markdown
# Todo Console App

A simple command-line todo application with in-memory storage.

## Features
- Add, view, update, and delete tasks
- Mark tasks as complete
- Pure Python standard library (no external dependencies)

## Running
```bash
python main.py
```

## Commands
- `add <description>` - Add a new task
- `view` - View all tasks
- `update <id> <title>` - Update task description
- `complete <id>` - Mark task as complete
- `delete <id>` - Delete a task
- `help` - Show menu
- `exit` - Exit application

## Development
Run linter:
```bash
ruff check .
```

Auto-fix issues:
```bash
ruff check --fix .
```
```

## Running the Application

### Start the Application

```bash
python main.py
```

### Example Session

```
==================================================
TODO APP - Phase I
==================================================
Available commands:
  add <description>    - Add a new task
  view                 - View all tasks
  update <id> <title>  - Update task description
  complete <id>        - Mark task as complete
  delete <id>          - Delete a task
  help                 - Show this menu
  exit                 - Exit the application
==================================================

> add Buy groceries
✓ Task added: [1] Buy groceries

> add Complete project proposal
✓ Task added: [2] Complete project proposal

> view

Task List:
--------------------------------------------------
[1] Buy groceries
[2] Complete project proposal
--------------------------------------------------

> complete 1
✓ Task marked complete: [1] Buy groceries

> view

Task List:
--------------------------------------------------
[1] Buy groceries (COMPLETED)
[2] Complete project proposal
--------------------------------------------------

> update 2 Complete Phase I project proposal
✓ Task updated: [2] Complete Phase I project proposal

> delete 1
✓ Task deleted: [1]

> view

Task List:
--------------------------------------------------
[2] Complete Phase I project proposal
--------------------------------------------------

> exit
Goodbye!
```

## Verification

### Test All Features

1. **Add Tasks**:
   ```bash
   > add Test task 1
   > add Test task 2
   > add Test task 3
   ```

2. **View Tasks**:
   ```bash
   > view
   # Should show all 3 tasks
   ```

3. **Update Task**:
   ```bash
   > update 1 Updated test task
   > view
   # Should show updated title for task 1
   ```

4. **Mark Complete**:
   ```bash
   > complete 1
   > view
   # Should show task 1 with (COMPLETED) suffix
   ```

5. **Delete Task**:
   ```bash
   > delete 2
   > view
   # Should only show tasks 1 and 3
   ```

### Test Error Handling

1. **Invalid Task ID**:
   ```bash
   > complete 999
   # Should display: Error: Task with ID 999 not found
   ```

2. **Empty Description**:
   ```bash
   > add
   # Should display: Error: Please provide a task description
   ```

3. **Unknown Command**:
   ```bash
   > invalid
   # Should display: Error: Unknown command 'invalid'
   ```

4. **Whitespace-Only Title**:
   ```bash
   > add "     "
   # Should display: Error: Task description cannot be empty
   ```

## Development

### Code Quality Checks

```bash
# Run PEP8 linting
ruff check .

# Auto-fix linting issues
ruff check --fix .

# Check specific file
ruff check main.py
```

### Expected Output

Zero PEP8 violations should be reported:
```
All checks passed!
```

## Troubleshooting

### "Module not found" Error

Ensure you're running from the project directory:
```bash
cd todo-app
python main.py
```

### UV Command Not Found

Reinstall UV or use full path:
```bash
# Check UV installation
which uv

# Reinstall if needed
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Python Version Too Old

Check your Python version:
```bash
python --version
# Should be 3.13 or higher
```

## Next Steps

After implementing and testing the basic application:

1. ✅ Verify all 5 core operations work correctly
2. ✅ Confirm PEP8 compliance with zero violations
3. ✅ Test error handling for edge cases
4. ✅ Verify intuitive user experience

Then proceed to `/sp.tasks` to generate the implementation task list.
