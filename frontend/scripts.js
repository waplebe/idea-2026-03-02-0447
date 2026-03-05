document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Fetch tasks from the API
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.innerHTML = `
                    <span>${task.title}</span>
                    <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
                    <button class="completeBtn">${task.completed ? 'Undo' : 'Complete'}</button>
                `;
                taskList.appendChild(taskItem);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));

    // Add task functionality
    addTaskBtn.addEventListener('click', function() {
        const title = prompt('Enter task title:');
        const description = prompt('Enter task description:');

        if (title && description) {
            fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, description: description })
            })
            .then(response => response.json())
            .then(newTask => {
                // Refresh the task list
                fetch('/tasks')
                    .then(response => response.json())
                    .then(updatedTasks => {
                        taskList.innerHTML = '';
                        updatedTasks.forEach(task => {
                            const taskItem = document.createElement('div');
                            taskItem.innerHTML = `
                                <span>${task.title}</span>
                                <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
                                <button class="completeBtn">${task.completed ? 'Undo' : 'Complete'}</button>
                            `;
                            taskList.appendChild(taskItem);
                        });
                    })
                    .catch(error => console.error('Error fetching updated tasks:', error));
            })
            .catch(error => console.error('Error creating task:', error));
        }
    });

    // Complete/Undo task functionality
    taskList.querySelectorAll('.completeBtn').forEach(button => {
        button.addEventListener('click', function() {
            const taskItem = this.parentNode;
            const taskIndex = Array.from(taskList.children).indexOf(taskItem);
            const task = tasks[taskIndex];

            fetch(`/tasks/${task.id}`, {
                method: task.completed ? 'PUT' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: !task.completed })
            })
            .then(response => response.json())
            .then(updatedTask => {
                tasks[taskIndex] = updatedTask;
                taskItem.querySelector('span:first-child').textContent = updatedTask.title;
                taskItem.querySelector('span:nth-child(2)').className = updatedTask.completed ? 'completed' : '';
                taskItem.querySelector('.completeBtn').textContent = updatedTask.completed ? 'Undo' : 'Complete';
            })
            .catch(error => console.error('Error updating task:', error));
        });
    });
});