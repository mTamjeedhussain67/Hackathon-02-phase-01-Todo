# API Contract: TodoManager

**Feature**: 001-todo-console-app
**Date**: 2026-01-02
**Phase**: Phase 1 - Design & Contracts

## Overview

This document defines the API contract for the `TodoManager` class, which serves as the business logic layer for the Todo application. The `TodoManager` encapsulates all task operations and maintains the in-memory task storage.

## Class Definition

```python
from typing import List, Optional
from models import Task

class TodoManager:
    """Manages in-memory storage and operations for Todo tasks."""

    def __init__(self) -> None:
        """Initialize an empty task list."""
        ...

    def add_task(self, title: str) -> Task:
        """Add a new task with the given title."""
        ...

    def view_tasks(self) -> List[Task]:
        """Return all tasks in storage order."""
        ...

    def update_task(self, task_id: int, new_title: str) -> Task:
        """Update the title of an existing task."""
        ...

    def mark_complete(self, task_id: int) -> Task:
        """Mark a task as completed."""
        ...

    def delete_task(self, task_id: int) -> None:
        """Delete a task by ID."""
        ...

    def find_task(self, task_id: int) -> Optional[Task]:
        """Find a task by ID, returning None if not found."""
        ...
```

## Methods

### `__init__()`

**Signature**:
```python
def __init__(self) -> None
```

**Description**:
Initialize a new `TodoManager` instance with an empty task list.

**Parameters**: None

**Returns**: None

**Side Effects**:
- Creates empty internal `List[Task]` storage
- Initializes `next_id` counter to 1

**Raises**: None

**Example**:
```python
manager = TodoManager()
# manager.tasks is empty list
# manager.next_id == 1
```

---

### `add_task(title: str) -> Task`

**Signature**:
```python
def add_task(self, title: str) -> Task
```

**Description**:
Create a new task with the given title and add it to storage.

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `title` | `str` | The task description (must be non-empty after strip, max 500 chars) |

**Returns**:
- Type: `Task`
- The newly created task with assigned `id` and `completed = False`

**Side Effects**:
- Appends new `Task` to internal storage list
- Increments `next_id` counter for next task

**Raises**:
| Exception | Condition |
|-----------|-----------|
| `ValueError` | `title` is empty or whitespace-only after `strip()` |
| `ValueError` | `title` exceeds 500 characters |

**Example**:
```python
task = manager.add_task("Buy groceries")
# Returns: Task(id=1, title="Buy groceries", completed=False)
```

---

### `view_tasks() -> List[Task]`

**Signature**:
```python
def view_tasks(self) -> List[Task]
```

**Description**:
Return all tasks in their current storage order (insertion order).

**Parameters**: None

**Returns**:
- Type: `List[Task]`
- A list containing all tasks (empty list if no tasks exist)
- Tasks are in insertion order (oldest to newest)

**Side Effects**: None (read-only operation)

**Raises**: None

**Example**:
```python
tasks = manager.view_tasks()
# Returns: [Task(id=1, title="Buy groceries", completed=False), ...]
```

---

### `update_task(task_id: int, new_title: str) -> Task`

**Signature**:
```python
def update_task(self, task_id: int, new_title: str) -> Task
```

**Description**:
Update the title of an existing task. The task's completion status is preserved.

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `task_id` | `int` | The ID of the task to update |
| `new_title` | `str` | The new task description (same validation as `add_task`) |

**Returns**:
- Type: `Task`
- The updated task object with modified `title`

**Side Effects**:
- Modifies the `title` attribute of the matching task in storage
- Does NOT change the task's `completed` status

**Raises**:
| Exception | Condition |
|-----------|-----------|
| `ValueError` | No task with `task_id` exists in storage |
| `ValueError` | `new_title` is empty or whitespace-only after `strip()` |
| `ValueError` | `new_title` exceeds 500 characters |

**Example**:
```python
task = manager.update_task(1, "Buy groceries and milk")
# Original task title is updated, completed status unchanged
```

---

### `mark_complete(task_id: int) -> Task`

**Signature**:
```python
def mark_complete(self, task_id: int) -> Task
```

**Description**:
Mark a task as completed by setting its `completed` attribute to `True`.

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `task_id` | `int` | The ID of the task to mark complete |

**Returns**:
- Type: `Task`
- The task object with `completed = True`

**Side Effects**:
- Modifies the `completed` attribute of the matching task to `True`
- Idempotent: calling on an already-complete task is safe (no change)

**Raises**:
| Exception | Condition |
|-----------|-----------|
| `ValueError` | No task with `task_id` exists in storage |

**Example**:
```python
task = manager.mark_complete(1)
# Returns: Task(id=1, title="Buy groceries", completed=True)
```

---

### `delete_task(task_id: int) -> None`

**Signature**:
```python
def delete_task(self, task_id: int) -> None
```

**Description**:
Remove a task from storage by its ID. The ID is not reused.

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `task_id` | `int` | The ID of the task to delete |

**Returns**: None

**Side Effects**:
- Removes the matching task from internal storage list
- Creates a gap in the ID sequence (IDs are never reused)
- Reduces total task count by 1

**Raises**:
| Exception | Condition |
|-----------|-----------|
| `ValueError` | No task with `task_id` exists in storage |

**Example**:
```python
manager.delete_task(1)
# Task with ID 1 is removed from storage
# Future tasks will get IDs 2, 3, 4... (not reused)
```

---

### `find_task(task_id: int) -> Optional[Task]`

**Signature**:
```python
def find_task(self, task_id: int) -> Optional[Task]
```

**Description**:
Find a task by ID without raising an exception if not found. This is a helper method used internally by other methods.

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `task_id` | `int` | The ID of the task to find |

**Returns**:
- Type: `Optional[Task]`
- The `Task` object if found
- `None` if no task with that ID exists

**Side Effects**: None (read-only operation)

**Raises**: None

**Example**:
```python
task = manager.find_task(1)
if task:
    print(f"Found: {task.title}")
else:
    print("Task not found")
```

## Usage Example

```python
from todo_manager import TodoManager

# Initialize
manager = TodoManager()

# Add tasks
task1 = manager.add_task("Buy groceries")
task2 = manager.add_task("Complete project")
task3 = manager.add_task("Call dentist")

# View all tasks
all_tasks = manager.view_tasks()
# Returns: [task1, task2, task3]

# Update a task
updated = manager.update_task(1, "Buy groceries and milk")

# Mark complete
manager.mark_complete(1)
# task1.completed is now True

# Delete a task
manager.delete_task(2)
# Only task1 and task3 remain
```

## Implementation Notes

### Private Attributes

The `TodoManager` should maintain these private attributes:

```python
_tasks: List[Task]      # Internal storage list
_next_id: int           # Counter for assigning unique IDs
```

### ID Assignment Strategy

- Sequential assignment starting from 1
- Never reuse deleted task IDs
- Increment after each successful `add_task()`

### Thread Safety

**Not Applicable** - Phase I is single-threaded, synchronous console application. No concurrent access expected.

---

**Related Documents**:
- [Data Model](../data-model.md) - Task entity definition
- [Research](../research.md) - Architecture decisions
