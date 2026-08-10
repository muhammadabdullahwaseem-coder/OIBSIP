/**
 * OIBSIP Web Development Level 2 Task 3 - To-Do List Engine
 * Features: Pending vs Completed list separation, inline text editing, priority tags,
 * localStorage persistence, real-time counters, search filtering, empty states.
 */

class TaskManager {
    constructor() {
        this.tasks = this.loadFromStorage();
        this.searchQuery = '';
        this.priorityFilter = 'all';

        // DOM Element References
        this.todoForm = document.getElementById('todo-form');
        this.taskInput = document.getElementById('task-input');
        this.taskPrioritySelect = document.getElementById('task-priority');
        
        this.pendingList = document.getElementById('pending-task-list');
        this.completedList = document.getElementById('completed-task-list');
        
        this.pendingCountBadge = document.getElementById('pending-count-badge');
        this.completedCountBadge = document.getElementById('completed-count-badge');
        
        this.pendingEmptyState = document.getElementById('pending-empty-state');
        this.completedEmptyState = document.getElementById('completed-empty-state');
        
        this.totalTasksStat = document.getElementById('total-tasks-stat');
        this.completedPctStat = document.getElementById('completed-pct-stat');
        
        this.searchInput = document.getElementById('search-input');
        this.filterPrioritySelect = document.getElementById('filter-priority-select');
        this.clearCompletedBtn = document.getElementById('clear-completed-btn');

        this.initEventListeners();
        this.render();
    }

    /**
     * Initializes event listeners via Pure JS (No inline HTML handlers)
     */
    initEventListeners() {
        // Form Submission
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Search & Priority Filter Listeners
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.render();
        });

        this.filterPrioritySelect.addEventListener('change', (e) => {
            this.priorityFilter = e.target.value;
            this.render();
        });

        // Clear Completed Tasks
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        // Event Delegation for Pending List
        this.pendingList.addEventListener('click', (e) => this.handleTaskAction(e));
        
        // Event Delegation for Completed List
        this.completedList.addEventListener('click', (e) => this.handleTaskAction(e));
    }

    /**
     * Creates and adds a new task to the pending queue
     */
    addTask() {
        const text = this.taskInput.value.trim();
        const priority = this.taskPrioritySelect.value;

        if (!text) return;

        const newTask = {
            id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            text: text,
            priority: priority,
            completed: false,
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };

        this.tasks.unshift(newTask);
        this.saveToStorage();
        
        // Reset Input
        this.taskInput.value = '';
        this.taskInput.focus();
        
        this.render();
        this.showToast('Task added to pending list');
    }

    /**
     * Handles task action clicks (toggle complete, edit, save, delete)
     */
    handleTaskAction(e) {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.id;

        // Toggle Complete Checkbox
        if (target.closest('.custom-checkbox') || target.classList.contains('task-title')) {
            this.toggleComplete(taskId);
            return;
        }

        // Delete Button
        if (target.closest('.delete-btn')) {
            this.deleteTask(taskId);
            return;
        }

        // Edit Button
        if (target.closest('.edit-btn')) {
            this.enableInlineEdit(taskItem, taskId);
            return;
        }

        // Save Edit Button
        if (target.closest('.save-btn')) {
            const editInput = taskItem.querySelector('.edit-input');
            if (editInput) {
                this.saveTaskEdit(taskId, editInput.value);
            }
            return;
        }

        // Cancel Edit Button
        if (target.closest('.cancel-btn')) {
            this.render();
            return;
        }
    }

    /**
     * Toggles task completion status (moves item between Pending and Completed lists)
     */
    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        this.saveToStorage();
        this.render();

        const message = task.completed ? 'Task marked as completed! 🎉' : 'Task moved back to pending list';
        this.showToast(message);
    }

    /**
     * Enables inline editing mode for a task item
     */
    enableInlineEdit(taskItem, id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const taskInfoEl = taskItem.querySelector('.task-info');
        const actionsEl = taskItem.querySelector('.task-actions');

        // Replace task info with edit input
        taskInfoEl.innerHTML = `
            <input type="text" class="edit-input" value="${this.escapeHtml(task.text)}">
        `;

        // Replace action buttons with Save & Cancel
        actionsEl.innerHTML = `
            <button class="btn-icon-action save-btn" title="Save">💾</button>
            <button class="btn-icon-action cancel-btn" title="Cancel">❌</button>
        `;

        const editInput = taskInfoEl.querySelector('.edit-input');
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);

        // Allow pressing Enter to Save
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveTaskEdit(id, editInput.value);
            } else if (e.key === 'Escape') {
                this.render();
            }
        });
    }

    /**
     * Saves inline edited text for a task
     */
    saveTaskEdit(id, newText) {
        const trimmed = newText.trim();
        if (!trimmed) {
            this.showToast('Task text cannot be empty');
            return;
        }

        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        task.text = trimmed;
        this.saveToStorage();
        this.render();
        this.showToast('Task updated successfully');
    }

    /**
     * Permanently deletes a task
     */
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
        this.showToast('Task permanently deleted');
    }

    /**
     * Clears all completed tasks
     */
    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showToast('No completed tasks to clear');
            return;
        }

        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveToStorage();
        this.render();
        this.showToast(`Cleared ${completedCount} completed task(s)`);
    }

    /**
     * Renders the UI lists, counters, and empty states
     */
    render() {
        // Filter tasks based on search query & priority filter
        const filtered = this.tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(this.searchQuery);
            const matchesPriority = this.priorityFilter === 'all' || task.priority === this.priorityFilter;
            return matchesSearch && matchesPriority;
        });

        const pendingTasks = filtered.filter(t => !t.completed);
        const completedTasks = filtered.filter(t => t.completed);

        // Render Pending List
        this.pendingList.innerHTML = pendingTasks.map(t => this.createTaskHTML(t)).join('');

        // Render Completed List
        this.completedList.innerHTML = completedTasks.map(t => this.createTaskHTML(t)).join('');

        // Update Dynamic Count Badges
        const totalPending = this.tasks.filter(t => !t.completed).length;
        const totalCompleted = this.tasks.filter(t => t.completed).length;

        this.pendingCountBadge.textContent = `${totalPending} Pending`;
        this.completedCountBadge.textContent = `${totalCompleted} Completed`;

        // Update Header Stats
        const totalCount = this.tasks.length;
        const pct = totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;
        this.totalTasksStat.textContent = totalCount;
        this.completedPctStat.textContent = `${pct}%`;

        // Toggle Empty States
        if (pendingTasks.length === 0) {
            this.pendingEmptyState.classList.remove('hidden');
        } else {
            this.pendingEmptyState.classList.add('hidden');
        }

        if (completedTasks.length === 0) {
            this.completedEmptyState.classList.remove('hidden');
        } else {
            this.completedEmptyState.classList.add('hidden');
        }
    }

    /**
     * Generates HTML markup for a task item
     */
    createTaskHTML(task) {
        return `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-left">
                    <div class="custom-checkbox" title="Mark as ${task.completed ? 'pending' : 'complete'}"></div>
                    <div class="task-info">
                        <span class="task-title">${this.escapeHtml(task.text)}</span>
                        <div class="task-meta">
                            <span class="prio-badge prio-${task.priority}">${task.priority}</span>
                            <span>Created ${task.createdAt}</span>
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-icon-action edit-btn" title="Edit Task">✏️</button>
                    <button class="btn-icon-action delete-btn" title="Delete Task">🗑️</button>
                </div>
            </li>
        `;
    }

    /* --- LocalStorage & Helper Methods --- */
    saveToStorage() {
        try {
            localStorage.setItem('oibsip_todo_tasks', JSON.stringify(this.tasks));
        } catch (e) {
            console.warn('LocalStorage save error', e);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('oibsip_todo_tasks');
            return saved ? JSON.parse(saved) : [
                { id: 'task_demo_1', text: 'Complete OIBSIP WebDev Task 3', priority: 'high', completed: false, createdAt: 'Today, 10:00 AM' },
                { id: 'task_demo_2', text: 'Review project codebase & submit', priority: 'medium', completed: false, createdAt: 'Today, 11:30 AM' },
                { id: 'task_demo_3', text: 'Setup developer workspace', priority: 'low', completed: true, createdAt: 'Yesterday' }
            ];
        } catch (e) {
            return [];
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    }

    escapeHtml(str) {
        return str.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }
}

// Instantiate App Engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.taskApp = new TaskManager();
});
