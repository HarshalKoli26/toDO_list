document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const showAllBtn = document.getElementById('showAll');
    const showActiveBtn = document.getElementById('showActive');
    const showCompletedBtn = document.getElementById('showCompleted');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTasks();
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        
        showAllBtn.addEventListener('click', () => filterTasks('all'));
        showActiveBtn.addEventListener('click', () => filterTasks('active'));
        showCompletedBtn.addEventListener('click', () => filterTasks('completed'));
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
        renderTasks();
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' ? 'No tasks yet!' : 
                                        currentFilter === 'active' ? 'No active tasks!' : 'No completed tasks!';
            emptyMessage.classList.add('empty-message');
            taskList.appendChild(emptyMessage);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.dataset.id = task.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', toggleTask);
            
            const taskText = document.createElement('span');
            taskText.classList.add('task-text');
            if (task.completed) taskText.classList.add('completed');
            taskText.textContent = task.text;
            
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', editTask);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', deleteTask);
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(editBtn);
            taskItem.appendChild(deleteBtn);
            
            taskList.appendChild(taskItem);
        });
    }
    
    // Toggle task completion status
    function toggleTask(e) {
        const taskId = parseInt(e.target.parentElement.dataset.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = e.target.checked;
            saveTasks();
            renderTasks();
        }
    }
    
    // Edit task
    function editTask(e) {
        const taskId = parseInt(e.target.parentElement.dataset.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        const taskTextElement = e.target.previousElementSibling;
        
        const newText = prompt('Edit your task:', tasks[taskIndex].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[taskIndex].text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
    
    // Delete task
    function deleteTask(e) {
        if (confirm('Are you sure you want to delete this task?')) {
            const taskId = parseInt(e.target.parentElement.dataset.id);
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    }
    
    // Filter tasks
    function filterTasks(filter) {
        currentFilter = filter;
        
        // Update active button state
        showAllBtn.classList.remove('active');
        showActiveBtn.classList.remove('active');
        showCompletedBtn.classList.remove('active');
        
        if (filter === 'all') showAllBtn.classList.add('active');
        else if (filter === 'active') showActiveBtn.classList.add('active');
        else if (filter === 'completed') showCompletedBtn.classList.add('active');
        
        renderTasks();
    }
    
    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Initialize the app
    init();
    filterTasks('all'); // Set 'all' as default filter
});