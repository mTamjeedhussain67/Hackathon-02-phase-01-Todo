"""Business logic layer for Todo application."""

from typing import List, Optional

from models import Task


class TodoManager:
    """Manages in-memory storage and operations for Todo tasks."""

    def __init__(self) -> None:
        """Initialize an empty task list."""
        self._tasks: List[Task] = []
        self._next_id: int = 1

    def add_task(self, title: str) -> Task:
        """Add a new task with the given title.

        Args:
            title: The task description (must be non-empty after strip, max 500 chars)

        Returns:
            The newly created task with assigned id and completed = False

        Raises:
            ValueError: If title is empty/whitespace-only or exceeds 500 characters
        """
        if not title or not title.strip():
            raise ValueError("Task description cannot be empty")
        if len(title) > 500:
            raise ValueError("Task description too long (max 500 characters)")

        task = Task(id=self._next_id, title=title.strip(), completed=False)
        self._tasks.append(task)
        self._next_id += 1
        return task

    def view_tasks(self) -> List[Task]:
        """Return all tasks in storage order.

        Returns:
            A list containing all tasks (empty list if no tasks exist).
            Tasks are in insertion order (oldest to newest).
        """
        return self._tasks.copy()

    def update_task(self, task_id: int, new_title: str) -> Task:
        """Update the title of an existing task.

        Args:
            task_id: The ID of the task to update
            new_title: The new task description (same validation as add_task)

        Returns:
            The updated task object with modified title

        Raises:
            ValueError: If task_id not found or new_title is invalid
        """
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
        """Mark a task as completed.

        Args:
            task_id: The ID of the task to mark complete

        Returns:
            The task object with completed = True

        Raises:
            ValueError: If task_id not found
        """
        task = self.find_task(task_id)
        if task is None:
            raise ValueError(f"Task with ID {task_id} not found")

        task.completed = True
        return task

    def delete_task(self, task_id: int) -> None:
        """Delete a task by ID.

        Args:
            task_id: The ID of the task to delete

        Raises:
            ValueError: If task_id not found
        """
        task = self.find_task(task_id)
        if task is None:
            raise ValueError(f"Task with ID {task_id} not found")

        self._tasks.remove(task)

    def find_task(self, task_id: int) -> Optional[Task]:
        """Find a task by ID, returning None if not found.

        Args:
            task_id: The ID of the task to find

        Returns:
            The Task object if found, None otherwise
        """
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None
