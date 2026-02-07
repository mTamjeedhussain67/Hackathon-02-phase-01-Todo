// ========================================
// TODO APP - JAVASCRIPT
// ========================================

class TodoApp {
    constructor() {
        this.todos = this.loadFromStorage();
        this.nextId = this.getNextId();
        this.editingId = null;
        this.theme = this.loadTheme();

        // DOM Elements
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.stats = document.getElementById('stats');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.remainingTasks = document.getElementById('remainingTasks');
        this.themeToggle = document.getElementById('themeToggle');

        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        this.todoForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.applyTheme();
        this.render();
    }

    // ========================================
    // LOCAL STORAGE
    // ========================================

    loadFromStorage() {
        const stored = localStorage.getItem('todos');
        return stored ? JSON.parse(stored) : [];
    }

    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    getNextId() {
        if (this.todos.length === 0) return 1;
        return Math.max(...this.todos.map(todo => todo.id)) + 1;
    }

    // ========================================
    // THEME MANAGEMENT
    // ========================================

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    }

    applyTheme() {
        if (this.theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            this.themeToggle.textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            this.themeToggle.textContent = '🌙';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        this.showFeedback(`Switched to ${this.theme} mode!`);
    }

    // ========================================
    // CRUD OPERATIONS
    // ========================================

    addTodo(title) {
        const newTodo = {
            id: this.nextId++,
            title: title.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(newTodo);
        this.saveToStorage();
        this.render();

        // Show success feedback
        this.showFeedback('Task added successfully!');
    }

    deleteTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            // Animate removal
            const todoElement = document.querySelector(`[data-id="${id}"]`);
            if (todoElement) {
                todoElement.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    this.todos.splice(index, 1);
                    this.saveToStorage();
                    this.render();
                    this.showFeedback('Task deleted!');
                }, 300);
            }
        }
    }

    updateTodo(id, newTitle) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.title = newTitle.trim();
            this.saveToStorage();
            this.render();
            this.showFeedback('Task updated!');
        }
    }

    toggleComplete(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    // ========================================
    // FORM HANDLING
    // ========================================

    handleSubmit(e) {
        e.preventDefault();

        const title = this.todoInput.value.trim();

        if (!title) {
            this.showFeedback('Please enter a task!', 'error');
            return;
        }

        if (this.editingId !== null) {
            // Update existing todo
            this.updateTodo(this.editingId, title);
            this.editingId = null;
            this.todoForm.querySelector('.btn-primary span').textContent = 'Add Task';
        } else {
            // Add new todo
            this.addTodo(title);
        }

        this.todoInput.value = '';
        this.todoInput.focus();
    }

    startEdit(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            this.editingId = id;
            this.todoInput.value = todo.title;
            this.todoInput.focus();
            this.todoForm.querySelector('.btn-primary span').textContent = 'Update Task';
        }
    }

    // ========================================
    // RENDERING
    // ========================================

    render() {
        // Clear list
        this.todoList.innerHTML = '';

        // Show empty state or todos
        if (this.todos.length === 0) {
            this.emptyState.style.display = 'block';
            this.stats.style.display = 'none';
        } else {
            this.emptyState.style.display = 'none';
            this.stats.style.display = 'flex';

            // Render todos
            this.todos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                this.todoList.appendChild(todoElement);
            });

            // Update stats
            this.updateStats();
        }
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);

        li.innerHTML = `
            <div class="checkbox-wrapper">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    id="checkbox-${todo.id}"
                >
            </div>
            <label for="checkbox-${todo.id}" class="todo-text">${this.escapeHtml(todo.title)}</label>
            <div class="todo-actions">
                <button class="btn btn-icon btn-edit" title="Edit task">
                    ✏️
                </button>
                <button class="btn btn-icon btn-delete" title="Delete task">
                    🗑️
                </button>
            </div>
        `;

        // Event listeners
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => this.toggleComplete(todo.id));

        const editBtn = li.querySelector('.btn-edit');
        editBtn.addEventListener('click', () => this.startEdit(todo.id));

        const deleteBtn = li.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        return li;
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const remaining = total - completed;

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.remainingTasks.textContent = remaining;
    }

    // ========================================
    // UTILITIES
    // ========================================

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showFeedback(message, type = 'success') {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            font-weight: 600;
        `;
        feedback.textContent = message;

        document.body.appendChild(feedback);

        // Remove after 2 seconds
        setTimeout(() => {
            feedback.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }
}

// ========================================
// INITIALIZE APP
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
