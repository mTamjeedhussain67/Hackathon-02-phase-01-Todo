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
        print("Select an option:")
        print("  1. Add Task")
        print("  2. Delete Task")
        print("  3. Update Task")
        print("  4. View Task List")
        print("  5. Mark as Complete")
        print("  6. Help / Show Menu")
        print("  7. Exit")
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
            status = " ✓" if task.completed else ""
            print(f"[{task.id}] {task.title}{status}")
        print("-" * 50)

    def add_task(self) -> None:
        """Handle adding a new task."""
        title = input("\nEnter task description: ").strip()
        if not title:
            print("Error: Task description cannot be empty")
            return
        try:
            task = self.manager.add_task(title)
            print(f"✓ Task added: [{task.id}] {task.title}")
        except ValueError as e:
            print(f"Error: {e}")

    def delete_task(self) -> None:
        """Handle deleting a task."""
        try:
            task_id = int(input("\nEnter task ID to delete: ").strip())
            self.manager.delete_task(task_id)
            print(f"✓ Task deleted: [{task_id}]")
        except ValueError:
            print("Error: Please enter a valid task ID")

    def update_task(self) -> None:
        """Handle updating a task."""
        try:
            task_id = int(input("\nEnter task ID to update: ").strip())
            new_title = input("Enter new description: ").strip()
            if not new_title:
                print("Error: Task description cannot be empty")
                return
            task = self.manager.update_task(task_id, new_title)
            print(f"✓ Task updated: [{task.id}] {task.title}")
        except ValueError as e:
            print(f"Error: {e}")

    def mark_complete(self) -> None:
        """Handle marking a task as complete."""
        try:
            task_id = int(input("\nEnter task ID to mark complete: ").strip())
            task = self.manager.mark_complete(task_id)
            print(f"✓ Task marked complete: [{task.id}] {task.title}")
        except ValueError as e:
            print(f"Error: {e}")

    def run(self) -> None:
        """Run the main application loop."""
        self.show_menu()

        while True:
            try:
                choice = input("\nSelect option (1-7): ").strip()

                if choice == "1":
                    self.add_task()

                elif choice == "2":
                    self.delete_task()

                elif choice == "3":
                    self.update_task()

                elif choice == "4":
                    self.show_tasks()

                elif choice == "5":
                    self.mark_complete()

                elif choice == "6":
                    self.show_menu()

                elif choice == "7":
                    print("Goodbye!")
                    break

                else:
                    print("Error: Invalid selection. Please enter a number between 1 and 7")
                    print("Select 6 to view the menu")

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
