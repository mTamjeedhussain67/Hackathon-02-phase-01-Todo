# Tasks: Phase I In-Memory Python Console Todo App

**Input**: Design documents from `/specs/001-todo-console-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/todo-manager-api.md, quickstart.md

**Tests**: Manual console testing per Phase I scope (no automated tests)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a single-project console application. All source files are at repository root per plan.md structure.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create todo-app directory and initialize UV project with `uv init todo-app` in todo-app/
- [X] T002 Navigate to todo-app directory and add dev dependency ruff with `uv add --dev ruff`
- [X] T003 [P] Create README.md in todo-app/ with project description and usage instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data model that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create Task dataclass in todo-app/models.py with id, title, and completed attributes
- [X] T005 [P] Create TodoManager class in todo-app/todo_manager.py with __init__, _tasks list, and _next_id counter

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Task (Priority: P1) 🎯 MVP

**Goal**: Users can capture new tasks with descriptions and receive confirmation

**Independent Test**: Start application, add a single task with description, verify confirmation message displays

### Implementation for User Story 1

- [X] T006 [US1] Implement add_task method in todo-app/todo_manager.py with title validation (non-empty, max 500 chars)
- [X] T007 [US1] Implement add command parsing in todo-app/main.py with error handling for missing description
- [X] T008 [US1] Add success confirmation message display in todo-app/main.py after task addition
- [X] T009 [US1] Implement help menu display in todo-app/main.py showing all available commands
- [X] T010 [US1] Add REPL loop in todo-app/main.py with command input and exit handling

**Checkpoint**: At this point, users can add tasks and see confirmation - MVP core value delivered

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Users can see all captured tasks with identifiers, descriptions, and completion status

**Independent Test**: Add multiple tasks, run view command, verify all tasks appear with correct information and status

### Implementation for User Story 2

- [X] T011 [US2] Implement view_tasks method in todo-app/todo_manager.py returning copy of internal task list
- [X] T012 [US2] Implement view command handler in todo-app/main.py displaying tasks with format [id] title (COMPLETED)
- [X] T013 [US2] Add empty state message in todo-app/main.py ("No tasks available. Add a task to get started!")
- [X] T014 [US2] Implement task display formatting in todo-app/main.py with completion status suffix

**Checkpoint**: Users can now add and view tasks - core value loop complete

---

## Phase 5: User Story 3 - Mark Task Complete (Priority: P2)

**Goal**: Users can mark tasks as done and see the status change reflected

**Independent Test**: Add a task, mark it complete, run view command to confirm status changed to COMPLETED

### Implementation for User Story 3

- [X] T015 [US3] Implement find_task helper method in todo-app/todo_manager.py returning Optional[Task]
- [X] T016 [US3] Implement mark_complete method in todo-app/todo_manager.py with task ID existence validation
- [X] T017 [US3] Implement complete command parsing in todo-app/main.py with task ID argument
- [X] T018 [US3] Add confirmation message display in todo-app/main.py after marking task complete
- [X] T019 [US3] Add error handling in todo-app/main.py for invalid task IDs on complete command

**Checkpoint**: Users can now track task completion - primary workflow benefit delivered

---

## Phase 6: User Story 4 - Update Task Description (Priority: P2)

**Goal**: Users can modify existing task descriptions

**Independent Test**: Add a task, update its description, run view command to confirm new text appears

### Implementation for User Story 4

- [X] T020 [US4] Implement update_task method in todo-app/todo_manager.py with ID and new title validation
- [X] T021 [US4] Implement update command parsing in todo-app/main.py with task ID and new title arguments
- [X] T022 [US4] Add confirmation message display in todo-app/main.py after task update
- [X] T023 [US4] Add error handling in todo-app/main.py for invalid IDs and empty descriptions

**Checkpoint**: Users can now refine task descriptions - data accuracy maintained

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Users can remove tasks they no longer need

**Independent Test**: Add a task, delete it, run view command to confirm it no longer appears

### Implementation for User Story 5

- [X] T024 [US5] Implement delete_task method in todo-app/todo_manager.py with task ID existence validation
- [X] T025 [US5] Implement delete command parsing in todo-app/main.py with task ID argument
- [X] T026 [US5] Add confirmation message display in todo-app/main.py after task deletion
- [X] T027 [US5] Add error handling in todo-app/main.py for invalid task IDs on delete command

**Checkpoint**: All five core operations now functional - feature complete

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, edge cases, and code quality

- [X] T028 [P] Add KeyboardInterrupt handling in todo-app/main.py for graceful Ctrl+C exit
- [X] T029 [P] Add unknown command error handling in todo-app/main.py with helpful error message
- [X] T030 [P] Add whitespace-only title validation in todo-app/todo_manager.py
- [X] T031 [P] Add docstrings to all classes and public methods in todo-app/models.py
- [X] T032 [P] Add docstrings to all classes and public methods in todo-app/todo_manager.py
- [X] T033 [P] Add type hints to all functions in todo-app/main.py
- [X] T034 Run PEP8 linting with `ruff check .` and fix any violations
- [X] T035 Run quickstart.md validation following all test scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order: P1 (US1, US2) → P2 (US3, US4, US5)
  - US1 and US2 are both P1 and deliver core value together
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Uses same TodoManager, independently testable
- **User Story 3 (P2)**: Can start after Foundational - May integrate with US1/US2 but independently testable
- **User Story 4 (P2)**: Can start after Foundational - Uses find_task from US3 but independently testable
- **User Story 5 (P2)**: Can start after Foundational - Uses find_task from US3 but independently testable

### Within Each User Story

- Models/services before command handlers
- Core implementation before error handling
- Story complete before moving to next priority

### Parallel Opportunities

- T003 (README) can run in parallel with T004 and T005
- T004 and T005 (foundational models) can run in parallel - different files
- Once Foundational phase completes, US3, US4, US5 could theoretically be developed in parallel (though they share find_task)
- T028-T033 (Polish phase documentation and type hints) can all run in parallel - different files

---

## Parallel Example: Foundational Phase

```bash
# Launch foundational files together:
Task T004: "Create Task dataclass in todo-app/models.py"
Task T005: "Create TodoManager class in todo-app/todo_manager.py"
```

---

## Parallel Example: Polish Phase

```bash
# Launch all polish tasks together:
Task T028: "Add KeyboardInterrupt handling in todo-app/main.py"
Task T029: "Add unknown command error handling in todo-app/main.py"
Task T030: "Add whitespace-only title validation in todo-app/todo_manager.py"
Task T031: "Add docstrings to all classes and public methods in todo-app/models.py"
Task T032: "Add docstrings to all classes and public methods in todo-app/todo_manager.py"
Task T033: "Add type hints to all functions in todo-app/main.py"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T005) - CRITICAL
3. Complete Phase 3: User Story 1 (T006-T010) - Add Task
4. Complete Phase 4: User Story 2 (T011-T014) - View Tasks
5. **STOP and VALIDATE**: Test adding and viewing tasks independently
6. Deploy/demo basic MVP (add + view = core value loop)

### Full Feature Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 + 2 → Test independently → MVP complete (add + view)
3. Add User Story 3 → Test independently → Mark complete feature
4. Add User Story 4 → Test independently → Update feature
5. Add User Story 5 → Test independently → Delete feature
6. Complete Polish → Final production-ready application

### Incremental Delivery Value

- **After US1+US2**: Users can add and view tasks - core value delivered
- **After US3**: Users can track completion - primary workflow benefit
- **After US4**: Users can refine descriptions - data accuracy maintained
- **After US5**: Users can remove clutter - full CRUD functionality

---

## Notes

- [P] tasks = different files, no dependencies
- [US#] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual console testing per quickstart.md verification section
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Phase I uses manual testing - no automated tests in scope
- PEP8 compliance required per constitution (use `ruff check .`)
