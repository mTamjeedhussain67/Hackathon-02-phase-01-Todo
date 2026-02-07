"""Data model definitions for Todo application."""

from dataclasses import dataclass


@dataclass
class Task:
    """Represents a single todo item.

    Attributes:
        id: Unique identifier for the task
        title: Human-readable description of the task
        completed: Completion status of the task (defaults to False)
    """
    id: int
    title: str
    completed: bool = False
