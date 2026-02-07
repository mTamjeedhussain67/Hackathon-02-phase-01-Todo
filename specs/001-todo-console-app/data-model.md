# Data Model: Phase I In-Memory Python Console Todo App

**Feature**: 001-todo-console-app
**Date**: 2026-01-02
**Phase**: Phase 1 - Design & Contracts

## Overview

This document defines the data model for the Todo application. Phase I uses a single entity (Task) with three attributes, stored in-memory as a list of objects.

## Entities

### Task

Represents a single todo item in the system.

**Attributes**:

| Name | Type | Description | Constraints |
|------|------|-------------|-------------|
| `id` | `int` | Unique identifier for the task | Must be positive integer, unique across all tasks |
| `title` | `str` | Human-readable description of the task | Must be non-empty after stripping whitespace, max 500 characters |
| `completed` | `bool` | Completion status of the task | `True` if task is complete, `False` if pending |

**Python Definition**:

```python
from dataclasses import dataclass

@dataclass
class Task:
    """Represents a single todo item."""
    id: int
    title: str
    completed: bool = False
```

**Validation Rules**:
1. **ID Validation**:
   - Must be a positive integer (> 0)
   - Must be unique across all tasks in the manager
   - Assigned sequentially starting from 1

2. **Title Validation**:
   - Cannot be empty or whitespace-only after `strip()`
   - Maximum length of 500 characters (per spec assumptions)
   - Special characters are allowed (user input preserved as-is)

3. **Completed Status**:
   - Defaults to `False` on task creation
   - Can be toggled to `True` via `mark_complete()` operation
   - Can be toggled back to `False` (not specified but reasonable)

## State Transitions

### Task Lifecycle

```
┌─────────────┐    add_task()     ┌─────────────┐
│   Doesn't   │ ─────────────────> │   Pending   │
│   Exist     │                   │ (completed: │
└─────────────┘                   │   False)    │
                                  └──────┬──────┘
                                         │
                                         │ mark_complete()
                                         │
                                         ↓
                                  ┌─────────────┐
                                  │  Completed  │
                                  │ (completed: │
                                  │   True)     │
                                  └─────────────┘
```

**Transitions**:
1. **Creation**: `Doesn't Exist` → `Pending` via `add_task(title)`
   - New task assigned next sequential ID
   - `completed` defaults to `False`

2. **Completion**: `Pending` → `Completed` via `mark_complete(task_id)`
   - Sets `completed = True`
   - Idempotent: calling on already-complete task is safe

3. **Deletion**: Any state → `Doesn't Exist` via `delete_task(task_id)`
   - Task removed from in-memory list
   - ID is not reused (gaps in sequence acceptable)

4. **Update**: Any state → Same state via `update_task(task_id, new_title)`
   - Only `title` changes, `completed` status preserved
   - Validation applies to new title

## Relationships

### Task Relationships

Phase I has **no relationships** between tasks. Each task is independent with:
- No parent/child hierarchy
- No dependencies between tasks
- No grouping or categorization
- No linking or association

**Future Extensions** (Out of Scope for Phase I):
- Task dependencies (blocking/subtasks)
- Project/task lists
- Tags or categories
- Priority levels

## Storage Model

### In-Memory List Storage

Tasks are stored in a Python `list[Task]` within the `TodoManager` class.

**Storage Characteristics**:
- **Structure**: Ordered list (insertion order preserved)
- **Access**: Sequential iteration for operations
- **Lifecycle**: Exists only for duration of application session
- **Persistence**: None - all data lost on application exit

**Performance Considerations**:
- **Add Task**: O(1) - append to end of list
- **View All Tasks**: O(n) - iterate entire list
- **Find by ID**: O(n) - linear search (acceptable for console scale)
- **Update by ID**: O(n) - find + O(1) update
- **Delete by ID**: O(n) - find + O(n) removal from list

**Capacity Limits**:
- No artificial limit on number of tasks
- Practical limit: available system memory
- Each task ~100 bytes overhead + title length
- Example: 10,000 tasks ≈ 1-2 MB memory usage

## Data Integrity

### Constraints Enforcement

**At Creation Time**:
1. Validate title is non-empty after stripping whitespace
2. Validate title length ≤ 500 characters
3. Assign unique sequential ID not currently in use
4. Set `completed = False` by default

**At Update Time**:
1. Validate task ID exists in storage
2. Validate new title meets same constraints as creation
3. Preserve `completed` status

**At Completion Time**:
1. Validate task ID exists in storage
2. Set `completed = True`

**At Deletion Time**:
1. Validate task ID exists in storage
2. Remove task from list
3. Do not reuse the ID

### Error Conditions

| Condition | Error Type | User Message |
|-----------|------------|--------------|
| Task ID not found | Lookup Error | "Task with ID {id} not found" |
| Empty title | Validation Error | "Task description cannot be empty" |
| Title exceeds 500 chars | Validation Error | "Task description too long (max 500 characters)" |
| Invalid command | Command Error | "Unknown command. Type 'help' for available commands" |

## Type Definitions

### Python Type Hints

```python
from typing import List

# Task entity
class Task:
    id: int
    title: str
    completed: bool

# Task collection type
TaskList = List[Task]

# Validation function signatures
def validate_title(title: str) -> bool: ...
def validate_task_id(task_id: int, tasks: TaskList) -> bool: ...
```

### Task Display Format

When displaying tasks in the console, use this format:

```
Task List:
---------
[1] Buy groceries
[2] Complete project proposal (COMPLETED)
[3] Schedule dentist appointment
```

Format specification:
- Display ID in brackets: `[id]`
- Title follows ID
- Append `(COMPLETED)` suffix if `completed = True`
- One task per line
- Empty state message: "No tasks available. Add a task to get started!"

## Migration Strategy

**Not Applicable** - Phase I uses in-memory storage with no persistence. No data migration required between sessions or versions.

---

**Next**: See [contracts/](./contracts/) for the TodoManager API interface definition.
