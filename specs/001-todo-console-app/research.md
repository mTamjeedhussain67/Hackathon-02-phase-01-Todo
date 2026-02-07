# Research: Phase I In-Memory Python Console Todo App

**Feature**: 001-todo-console-app
**Date**: 2026-01-02
**Phase**: Phase 0 - Research & Technology Decisions

## Overview

This document captures research findings and technology decisions for the Phase I In-Memory Python Console Todo App. All decisions align with the constitution principles and feature specification requirements.

## Technology Decisions

### Decision 1: Python 3.13+ as Primary Language

**Choice**: Python 3.13 or newer

**Rationale**:
- Constitution requirement: Python 3.x minimum
- User input explicitly specifies Python 3.13+
- Modern Python features improve code clarity (type hints, match statements)
- Wide platform support (Linux, macOS, Windows)
- Excellent standard library for console applications

**Alternatives Considered**:
- Python 3.7-3.9: Rejected due to user requirement for 3.13+
- Other languages (Rust, Go): Rejected due to constitution's Python requirement

**Implementation Notes**:
- Use `dataclasses` for clean model definitions
- Use `typing` module for type annotations
- Leverage `match` statements (Python 3.10+) for command parsing if desired

---

### Decision 2: UV for Project Management

**Choice**: UV (Astral's Python package manager) for project initialization and dependency management

**Rationale**:
- User input explicitly requires UV
- Modern, fast Python project tooling
- Simplified dependency management compared to pip/tools
- Built-in dev dependency handling (ruff for linting)

**Alternatives Considered**:
- Traditional pip + venv: Rejected per user requirement for UV
- Poetry: Rejected per user requirement for UV
- PDM: Rejected per user requirement for UV

**Implementation Notes**:
- Initialize with: `uv init todo-app`
- Add dev dependency: `uv add --dev ruff`
- Runtime dependencies: None (standard library only)

---

### Decision 3: Zero Runtime Dependencies

**Choice**: Pure Python standard library for all runtime functionality

**Rationale**:
- Constitution Principle V mandates zero external dependencies
- Feature spec requires in-memory storage (no database needed)
- Console UI well-supported by standard library (`input()`, `print()`)
- Maximizes portability and simplifies deployment

**Standard Library Modules to Use**:
- `dataclasses`: For Task model definition
- `typing`: For type annotations (`List`, `Optional`, etc.)
- `sys`: For clean exit handling
- Built-in types and control flow for all other functionality

**Implementation Notes**:
- No `pip install` required for runtime
- Code runs on any Python 3.13+ installation
- Dev-only dependency: ruff for PEP8 linting

---

### Decision 4: In-Memory List Storage

**Choice**: Python `list` of Task objects for task storage

**Rationale**:
- Constitution requires in-memory storage only
- Feature spec explicitly excludes persistence
- List provides O(1) append for adding tasks
- O(n) lookup acceptable for console-scale task counts
- Simple, idiomatic Python

**Alternatives Considered**:
- `dict` keyed by task ID: Rejected because list maintains order and is simpler
- Custom linked list: Rejected as unnecessary complexity
- Database (SQLite): Rejected per constitution constraint (no persistence)

**Implementation Notes**:
- Task IDs assigned sequentially starting from 1
- Delete operations remove item from list (or mark as deleted)
- All operations iterate list for lookups (acceptable at console scale)

---

### Decision 5: Modular Architecture Pattern

**Choice**: Three-layer separation: Models, Business Logic, UI Layer

**Rationale**:
- Constitution Principle I mandates modularity
- Each module has single, well-defined responsibility
- Enables independent testing and future extensibility
- Follows Python best practices for code organization

**Module Responsibilities**:
1. **models.py**: Task dataclass definition (data layer)
2. **todo_manager.py**: TodoManager class with CRUD methods (business logic)
3. **main.py**: Console REPL and user interaction (presentation layer)

**Alternatives Considered**:
- Single-file script: Rejected as violates modularity principle
- Full MVC pattern: Rejected as over-engineering for simple console app
- Class-based command handlers: Considered but adds unnecessary abstraction

**Implementation Notes**:
- Import flow: `main.py` → `todo_manager.py` → `models.py`
- No circular dependencies
- Clear module boundaries documented with docstrings

---

### Decision 6: REPL-Style Command Interface

**Choice**: Infinite loop with command parsing and menu display

**Rationale**:
- Feature spec describes console interaction with commands
- REPL pattern is intuitive for command-line applications
- Enables continuous workflow without restarts
- Standard pattern for console utilities

**Command Structure** (from spec assumptions):
- `add <description>` - Add a new task
- `view` - Display all tasks
- `update <id> <new_description>` - Update task description
- `complete <id>` - Mark task as complete
- `delete <id>` - Delete a task
- `help` - Show available commands
- `exit` - Exit the application

**Alternatives Considered**:
- Menu-driven with number selection: Rejected as slower for power users
- Argument-based commands only: Rejected as less discoverable
- GUI/TUI framework: Rejected per constitution (console only)

**Implementation Notes**:
- Use `input()` with prompt for command entry
- Parse commands with `split()` and validate argument count
- Display menu on startup and after each operation
- Handle Ctrl+C gracefully for clean exit

---

### Decision 7: Ruff for PEP8 Linting

**Choice**: Ruff (Astral's Python linter) for PEP8 compliance

**Rationale**:
- User input explicitly specifies ruff
- Extremely fast compared to traditional linters
- Compatible with PEP8 standards
- Integrates with UV workflow

**Alternatives Considered**:
- pylint: Rejected per user requirement for ruff
- flake8: Rejected per user requirement for ruff
- black (formatter only): Rejected as doesn't replace linter

**Implementation Notes**:
- Dev dependency only: `uv add --dev ruff`
- Run with: `ruff check .`
- Fix issues automatically: `ruff check --fix .`
- Zero violations required per constitution

---

## Architecture Patterns

### Separation of Concerns

```
┌─────────────────────────────────────┐
│           main.py (UI Layer)        │
│  - REPL loop                         │
│  - Command parsing                   │
│  - Input/output formatting           │
└──────────────┬──────────────────────┘
               │ calls
               ↓
┌─────────────────────────────────────┐
│   todo_manager.py (Business Logic)  │
│  - Task CRUD operations              │
│  - Validation logic                  │
│  - Task ID management                │
└──────────────┬──────────────────────┘
               │ uses
               ↓
┌─────────────────────────────────────┐
│      models.py (Data Layer)         │
│  - Task dataclass                    │
│  - Type definitions                  │
└─────────────────────────────────────┘
```

### Data Flow

1. **Add Task**: User input → `main.py` parses → `TodoManager.add_task()` → creates `Task` → appends to list
2. **View Tasks**: User input → `main.py` parses → `TodoManager.view_tasks()` → returns list → `main.py` formats and displays
3. **Update Task**: User input → `main.py` parses ID + new description → `TodoManager.update_task()` → finds and modifies task
4. **Complete Task**: User input → `main.py` parses ID → `TodoManager.mark_complete()` → finds and updates status
5. **Delete Task**: User input → `main.py` parses ID → `TodoManager.delete_task()` → finds and removes task

## Best Practices

### Python Code Style
- Follow PEP8 naming conventions (snake_case for functions/variables, PascalCase for classes)
- Use type hints for all function signatures
- Write docstrings for all classes and public methods
- Keep functions under 20 lines when possible
- Use descriptive names that reveal intent

### Error Handling
- Validate user input before processing
- Check task ID existence before operations
- Provide clear error messages with actionable guidance
- Handle `ValueError`, `IndexError` explicitly
- Use try/except for user input parsing

### Console UI Best Practices
- Display help text on startup
- Show confirmation messages for all successful operations
- Format task lists with clear alignment
- Use color only if standard library supports it (avoid dependencies)
- Handle Ctrl+C gracefully with try/except on `KeyboardInterrupt`

## Open Questions Resolved

All technical context items from plan.md have been resolved:
- ✅ Language/Version: Python 3.13+
- ✅ Primary Dependencies: None (standard library)
- ✅ Storage: In-memory list
- ✅ Testing: Manual console testing
- ✅ Target Platform: Any OS with Python 3.13+
- ✅ Project Type: Single project
- ✅ Performance Goals: <100ms for all operations
- ✅ Constraints: No external dependencies, PEP8 required
- ✅ Scale/Scope: Single user, single session

## Next Steps

Proceed to Phase 1 design:
1. Generate `data-model.md` with Task entity details
2. Generate `contracts/` documenting TodoManager API
3. Generate `quickstart.md` with setup and run instructions
