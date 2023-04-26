
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  if (taskText === '') {
    alert('Please enter a task.');
    return;
  }
  const taskList = document.getElementById('taskList');
  const newTask = document.createElement('div');
  newTask.className = 'list-item'
  const la = document.createElement('label');
  la.className = 'checkbox';
  const inp = document.createElement('input');
  inp.className = 'checkbox_input';
  inp.type = 'checkbox';
  inp.id = `${generateRandomId(10)}`;
  inp.setAttribute("onchange", "handleCheckboxChange(this)");
  const di = document.createElement('div');
  di.className = 'checkbox_box';
  la.appendChild(inp);
  la.appendChild(di);
  newTask.appendChild(la);
  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;
  newTask.appendChild(taskSpan);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function () {
    taskList.removeChild(newTask);
  };
  newTask.appendChild(deleteButton);
  taskList.appendChild(newTask);
  taskInput.value = '';
}

function addMCVTask(info) {
  const taskInput = document.getElementById('taskInput');
  const taskText = info.title;

  const taskList = document.getElementById('taskList');
  const newTask = document.createElement('div');
  newTask.className = 'list-item'
  const la = document.createElement('label');
  la.className = 'checkbox';
  const inp = document.createElement('input');
  inp.className = 'checkbox_input';
  inp.type = 'checkbox';
  inp.id = info.item_id;
  inp.setAttribute("onchange", "handleCheckboxChange(this)");


  const di = document.createElement('div');
  di.className = 'checkbox_box';

  la.appendChild(inp);
  la.appendChild(di);
  newTask.appendChild(la);
  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;
  newTask.appendChild(taskSpan);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function () {
    taskList.removeChild(newTask);
  };

  newTask.appendChild(deleteButton);
  taskList.appendChild(newTask);
  taskInput.value = '';

}




function generateRandomId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function handleCheckboxChange(checkbox) {
  if (checkbox.checked) {
    console.log(checkbox.id)//change to add in below list
  }
}


async function createMCVTask() {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://127.0.0.1:3000/courseville/assignment/2/2022`, options).then(res => res.json()).then(data => data.forEach(k => addMCVTask(k)))
    .catch((err) => { console.log("err") })
}
function login() {
  if (!localStorage.getItem('user_id')) {
    const options = {
      method: "GET",
      credentials: "include",
    };
    let user_id = ""
    fetch('http://127.0.0.1:3000/courseville/me', options).then(res => res.json()).then(data => {
      localStorage.setItem('user_id', data.user.id);
    });
  }
}

function calluser() {
  console.log(localStorage.getItem('user_id'))
}

async function testPost() {
  const Task = {
    task_name: "Task1",
    due_date: "15:4",
    user_id: localStorage.getItem('user_id'),
  };
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(Task)

  }
  await fetch(`http://127.0.0.1:3000/task/addTask`, options).then(res => res.json()).then(data => console.log(data))


}