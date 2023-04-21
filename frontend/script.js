function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
  
    if (taskText === '') {
      alert('Please enter a task.');
      return;
    }
  
    const taskList = document.getElementById('taskList');
    const newTask = document.createElement('li');
    newTask.textContent = taskText;
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
      taskList.removeChild(newTask);
    };
  
    newTask.appendChild(deleteButton);
    taskList.appendChild(newTask);
    taskInput.value = '';
  }
