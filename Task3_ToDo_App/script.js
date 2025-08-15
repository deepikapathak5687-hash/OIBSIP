document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const priorityInput = document.getElementById('priority-input');
    const dueDateInput = document.getElementById('due-date-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const themeToggle = document.getElementById('theme-toggle');

    // Load tasks and theme
    loadTasks();
    loadTheme();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    themeToggle.addEventListener('click', toggleTheme);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const priority = priorityInput.value;
        const dueDate = dueDateInput.value;
        const taskItem = createTaskElement(taskText, priority, dueDate);
        taskList.appendChild(taskItem);
        saveTasks();
        taskInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'low';
        taskInput.focus();
    }

    function createTaskElement(text, priority, dueDate, completed = false) {
        const li = document.createElement('li');
        li.classList.add('task-item', priority);
        if (completed) li.classList.add('completed');
        if (dueDate && new Date(dueDate) < new Date() && !completed) {
            li.classList.add('overdue');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox');
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            li.classList.remove('overdue');
            saveTasks();
        });

        const taskTextSpan = document.createElement('span');
        taskTextSpan.classList.add('task-text');
        taskTextSpan.textContent = text;

        const dueDateSpan = document.createElement('span');
        dueDateSpan.classList.add('due-date');
        dueDateSpan.textContent = dueDate ? `Due: ${new Date(dueDate).toLocaleDateString()}` : '';

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => editTask(taskTextSpan, dueDateSpan, li));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            li.style.opacity = '0';
            setTimeout(() => {
                li.remove();
                saveTasks();
            }, 300);
        });

        li.appendChild(checkbox);
        li.appendChild(taskTextSpan);
        li.appendChild(dueDateSpan);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        return li;
    }

    function editTask(taskTextSpan, dueDateSpan, li) {
        const newText = prompt('Edit task:', taskTextSpan.textContent);
        const newDueDate = prompt('Edit due date (YYYY-MM-DD):', dueDateSpan.textContent.replace('Due: ', ''));
        if (newText && newText.trim() !== '') {
            taskTextSpan.textContent = newText.trim();
            dueDateSpan.textContent = newDueDate ? `Due: ${new Date(newDueDate).toLocaleDateString()}` : '';
            li.classList.remove('overdue');
            if (newDueDate && new Date(newDueDate) < new Date() && !li.classList.contains('completed')) {
                li.classList.add('overdue');
            }
            saveTasks();
        }
    }

    function clearCompletedTasks() {
        const completedTasks = taskList.querySelectorAll('.task-item.completed');
        completedTasks.forEach(task => {
            task.style.opacity = '0';
            setTimeout(() => task.remove(), 300);
        });
        setTimeout(saveTasks, 300);
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                priority: Array.from(item.classList).find(cls => ['low', 'medium', 'high'].includes(cls)),
                dueDate: item.querySelector('.due-date').textContent.replace('Due: ', ''),
                completed: item.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.text, task.priority, task.dueDate, task.completed);
            taskList.appendChild(taskItem);
        });
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        themeToggle.innerHTML = document.body.classList.contains('dark-mode')
            ? '<i class="fas fa-sun"></i> Light Mode'
            : '<i class="fas fa-moon"></i> Dark Mode';
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    }

    function loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    }
});