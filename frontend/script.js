function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  if (taskText === '') {
    alert('Please enter a task.');
    return;
  }

  const taskList = document.getElementById('taskList');
  taskList.appendChild(getCompletedTaskItem(taskInput.value,new Date(2342342)));
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


function handleCheckboxChange(checkbox){
  if(checkbox.checked){
    console.log(checkbox.id)//change to add in below list
  }
}

function getDeadlineBox(now,outdate) {
  const hour = outdate.getHours();
  const minute = outdate.getMinutes();
  let time_string = hour.toString() + ":" + minute.toString();
  time_string = hour <= 9 ? "0" + time_string : time_string;
  let object = document.createElement("div");

  let top = document.createElement("div");
  top.className = "outdate_top";
  if(now > outdate) {
    top.style.background = "#D43F00";
  }
  else {
    top.style.background = "#1ED400";
  }

  let bottom = document.createElement("div");
  bottom.className = "outdate_bottom";
  bottom.textContent = time_string;

  object.appendChild(top);
  object.appendChild(bottom);
  object.className = "outdate";
  return object;
}

function getCheckBox() {
    const la=document.createElement('label');
    la.className='checkbox';
    const inp =document.createElement('input');
    inp.className='checkbox_input';
    inp.type='checkbox';
    inp.id=`${generateRandomId(10)}`;
    inp.setAttribute("onchange","handleCheckboxChange(this)");


    const di = document.createElement('div');
    di.className='checkbox_box';
    
    la.appendChild(inp);
    la.appendChild(di);
    return la
}

function getTaskItem(text, outdate) {
  if(text.length > 100) {
    text = text.slice(0,100) + "...";
  }
  let taskitem = document.createElement("div");
  taskitem.className = "taskitem"

  let front = document.createElement("div");
  front.style.display = "flex";
  front.appendChild(getCheckBox());
  let front_text = document.createElement("div");
  front_text.style = "margin-left: 3%; word-wrap: break-word; width: 21vw;";
  front_text.textContent = text;
  front.appendChild(front_text);

  let back = getDeadlineBox(Date.now(), outdate);

  let close_button = document.createElement("div");
  close_button.className = "taskitem_closebutton";
  close_button.textContent = "x";

  taskitem.appendChild(front);
  taskitem.appendChild(back);
  taskitem.appendChild(close_button)
  return taskitem;
}

function getCompletedTaskItem(text, outdate) {
  let taskItem = getTaskItem(text, outdate);

  let checkbox = taskItem.firstChild;
  checkbox.style.zIndex = 2;
  taskItem.querySelector('input[type="checkbox"]').checked = true;

  let close_button = taskItem.lastChild;
  close_button.style.zIndex = 2;

  let overlay = document.createElement("div");
  overlay.className = "completed_task_overlay";

  taskItem.appendChild(overlay);

  return taskItem;
}