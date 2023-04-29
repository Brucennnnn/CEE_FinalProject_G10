async function addTask(task) {
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task)
  };
  await fetch(`http://127.0.0.1:3000/task/addTask`, options)
    .then(res => res.json())
    .then(data => {
      createTaskitem({ ...task, task_id: data.id })

    })
    .catch(err => console.error(err.error))
}

// var redrawDOM = () => {
//   window.document.dispatchEvent(
//     new Event("DOMContentLoaded", {
//       bubbles: true,
//       cancelable: true,
//     })
//   );
// }

window.onload = async function getAllTask() {
  const options = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  }
  const completedTask = await fetch(`http://127.0.0.1:3000/task/getTasksByStatus/incompleted`, options).then(res => res.json()).catch(err => console.log(error));
  const mcvTask = await fetch(`http://127.0.0.1:3000/courseville/allAssignments/2/2022`, options).then(res => res.json()).catch(err => console.log(error));
  const allTasks = completedTask.concat(mcvTask);
  console.log(allTasks);
  renderTasklist(allTasks);

  // completedTask.forEach(task => {
  //   console.log(task)
  //   createTaskitem(task)
  // })
}

function createTaskitem(task) {
  let taskList = document.getElementsByClassName("foraddtask")[0];
  let taskitem = document.createElement('div');
  let checkandtext = document.createElement('div');
  let taskitemtext = document.createElement('div');
  let checkbox = document.createElement('label');
  let checkbox_input = document.createElement('input');
  let checkbox_box = document.createElement('div');

  let outdate = document.createElement('div');
  let outdate_top = document.createElement('div')
  let outdate_bottom = document.createElement('div')

  taskitem.className = "taskitem";
  taskitem.id = task.task_id;
  taskitemtext.className = "taskitemtext";
  checkandtext.className = "checkandtext";
  checkbox.className = "checkbox";
  checkbox_input.className = "checkbox_input";
  checkbox_box.className = "checkbox_box";

  outdate.className = "outdate";
  outdate_top.className = "outdate_top";
  outdate_bottom.className = "outdate_bottom";


  taskitem.onclick = function () {
    openDetailtaskOverlay({ task_id: task.task_id, task_name: task.task_name, task_description: task.task_description, due_date: task.due_date, tags: task.tags, status: task.status });
  }

  checkbox_input.onclick = function () {
    event.stopPropagation();
  }
  checkbox_box.onclick = function () {
    event.stopPropagation();
  }
  checkbox_input.type = "checkbox";
  checkbox_input.id = task.task_id;
  checkbox_input.setAttribute("onchange", "handleCheckboxChange(this)");

  taskitemtext.innerText = task.task_name;
  if (new Date(task.due_date).getHours().toString().length == 1) {
    outdate_bottom.innerText = "0" + new Date(task.due_date).getHours().toString() + ":"
  } else {
    outdate_bottom.innerText = new Date(task.due_date).getHours().toString() + ":"
  }

  if (new Date(task.due_date).getMinutes().toString().length == 1) {
    outdate_bottom.innerText += "0" + new Date(task.due_date).getMinutes().toString()
  } else {
    outdate_bottom.innerText += new Date(task.due_date).getMinutes().toString()
  }

  checkbox.appendChild(checkbox_input);
  checkbox.appendChild(checkbox_box);

  checkandtext.appendChild(checkbox);
  checkandtext.appendChild(taskitemtext);
  outdate.appendChild(outdate_top);
  outdate.appendChild(outdate_bottom);
  taskitem.appendChild(checkandtext);
  taskitem.appendChild(outdate);

  taskList.appendChild(taskitem);
}

function createMCVTaskitem(task) {
  let taskList = document.getElementsByClassName("foraddtask")[0];
  let taskitemmcv = document.createElement('div');
  let mcviconandtext = document.createElement('div');
  let mcvicon = document.createElement('img');
  let mcvtext = document.createElement('div');
  let mcvtextspan = document.createElement('span');
  let outdate = document.createElement('div');
  let outdate_top = document.createElement('div')
  let outdate_bottom = document.createElement('div')

  taskitemmcv.className = "taskitemmcv";
  mcviconandtext.className = "mcviconandtext";
  mcvicon.className = "mcvicon";
  mcvtext.className = "mcvtext";
  mcvtextspan.className = "mcvtextspan";
  outdate.className = "outdate";
  outdate_top.className = "outdate_top";
  outdate_bottom.className = "outdate_bottom";

  taskitemmcv.onclick = function () {
    openDetailmcvtaskOverlay({ course_title: task.course_title, title: task.title, instruction: task.instruction, duetime: task.duetime });
  }

  mcvtextspan.innerText = task.title;
  mcvicon.src = task.icon

  if (new Date(task.duetime).getHours().toString().length == 1) {
    outdate_bottom.innerText = "0" + new Date(task.duetime).getHours().toString() + ":"
  } else {
    outdate_bottom.innerText = new Date(task.duetime).getHours().toString() + ":"
  }

  if (new Date(task.time).getMinutes().toString().length == 1) {
    outdate_bottom.innerText += "0" + new Date(task.duetime).getMinutes().toString()
  } else {
    outdate_bottom.innerText += new Date(task.duetime).getMinutes().toString()
  }

  outdate.appendChild(outdate_top);
  outdate.appendChild(outdate_bottom);
  mcvtext.appendChild(mcvtextspan);
  mcviconandtext.appendChild(mcvicon);
  mcviconandtext.appendChild(mcvtext);
  taskitemmcv.appendChild(mcviconandtext);

  taskList.appendChild(taskitemmcv);
}
async function deleteTask(id) {
  const taskList = document.getElementsByClassName("foraddtask")[0];
  const taskitem = document.getElementById(id);
  taskList.removeChild(taskitem);
  const task = {
    task_id: id
  }
  const options = {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  }
  await fetch(`http://127.0.0.1:3000/task/deleteTask`, options).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));

}
async function handleCheckboxChange(checkbox) {
  if (checkbox.checked) {
    console.log(checkbox.id)
    const task = {
      task_id: checkbox.id,
      task_status: "completed",
    }
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    }
    try {

      const upDateTask = await fetch(`http://127.0.0.1:3000/task/updateTask`, options).then(res => res.json()).catch(err => console.log(err));
      const taskList = document.getElementsByClassName("foraddtask")[0];
      const taskitem = document.getElementById(checkbox.id);
      taskList.removeChild(taskitem);
      console.log(upDateTask)
    }
    catch (err) {
      console.log(err);
    }

  }

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


function openScreenOverlay() {
  let screenOverlay = document.createElement("div");
  screenOverlay.className = "overlay_screen";
  document.body.appendChild(screenOverlay);
}
function closeScreenOverlay() {
  document.querySelectorAll(".overlay_screen").forEach(overlay => {
    document.body.removeChild(overlay);
  });
}

async function getMCVTasks() {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://127.0.0.1:3000/courseville/allAssignments/2/2022`, options).then(res => res.json()).then(data => data.forEach(k => addMCVTask(k)))
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

function renderTasklist(tasks) {
  tasks.forEach(task => {
    if (task.tags === undefined) {
      // mcv task
      createMCVTaskitem(task);
    }
    else {
      // my task
      createTaskitem(task);
      console.log(task, 2)
    }
  });

}
function renderCompleteTasklist(today_task, yesterday_tasks, lastweek_tasks, lastmonth_task) {

}

function getDeadlineBox(dealine) {
  let now = Date().now();

  const hour = dealine.getHours();
  const minute = dealine.getMinutes();
  let time_string = hour.toString() + ":" + minute.toString();
  time_string = hour <= 9 ? "0" + time_string : time_string;
  let object = document.createElement("div");

  let top = document.createElement("div");
  top.className = "outdate_top";
  if (now > dealine) {
    top.style.background = "#E63946";
  }
  else {
    top.style.background = "#49DFC4";
  }

  let bottom = document.createElement("div");
  bottom.className = "outdate_bottom";
  bottom.textContent = time_string;

  object.appendChild(top);
  object.appendChild(bottom);
  object.className = "outdate";
  return object;
}



function getCheckBox(id) {
  const la = document.createElement('label');
  la.className = 'checkbox';
  const inp = document.createElement('input');
  inp.className = 'checkbox_input';
  inp.type = 'checkbox';
  inp.id = `${generateRandomId(10)}`;
  inp.setAttribute("onchange", `${handleCheckboxChange(id)}`);
  inp.onclick = "event.stopPropagation();"


  const di = document.createElement('div');
  di.className = 'checkbox_box';
  di.onclick = "event.stopPropagation();"

  la.appendChild(inp);
  la.appendChild(di);
  return la
}

function getTaskItem(info) {
  let text = info.task_name;
  let deadline = new Date(info.due_date);
  let id = info.task_id;

  if (text.length > 100) {
    text = text.slice(0, 100) + "...";
  }
  let taskitem = document.createElement("div");
  taskitem.className = "taskitem"
  taskitem.id = id;
  taskitem.onclick = `${openDetailtaskOverlay(getTaskInfo(id))}`;

  let front = document.createElement("div");
  front.style.display = "flex";
  front.appendChild(getCheckBox(id));
  let front_text = document.createElement("div");
  front_text.style = "margin-left: 3%; overflow-wrap: anywhere; width: 21vw;";
  front_text.textContent = text;
  front.appendChild(front_text);

  let back = getDeadlineBox(deadline);

  taskitem.appendChild(front);
  taskitem.appendChild(back);
  return taskitem;
}
function getMcvTaskItem(info) {
  let text = info.title;
  let id = info.item_id;
  let deadline = Date(info.duetime);
  let imgsrc = info.icon;

  if (text.length > 100) {
    text = text.slice(0, 100) + "...";
  }

  let taskitem = document.createElement("div");
  taskitem.className = "taskitemmcv";

  let front = document.createElement("div");
  front.style = "display:flex;";
  let icon = document.createElement("img");
  icon.style = "width: 3vw;height: 3vw;";
  icon.src = imgsrc;
  let title = document.createElemente("div");
  title.style = "color: white;margin-left: 1.024vw; overflow-wrap: anywhere; width: 21vw;display: flex;align-items: center;justify-content: left;";
  let content = document.createElement("span");
  content.textContent = text;

  taskitem.appendChild(front);
  taskitem.appendChild(getDeadlineBox(deadline));

  return taskitem;
}
function getCompletedTaskItem(info) {
  let text = info.title;
  let deadline = Date(info.duetime);
  let id = info.task_id

  let box = document.createElement("div");
  box.className = "taskitemcomplete";

  let front = document.createElement("div");
  front.style.display = "flex";
  let checkbox = getCheckBox(id);
  checkbox.querySelector('input[type="checkbox"]').checked = true;
  let text_content = document.createElement("div");
  text_content.style = "color: white;margin-left: 3%; word-wrap: break-word; width: 21vw;";
  text_content.textContent = text;
  front.appendChild(checkbox);
  front.appendChild(text_content);

  let deadline_box = getDeadlineBox(deadline);
  deadline_box.lastChild.style.color = "#646464";

  box.appendChild(front);
  box.appendChild(deadline);

  return box;
}
function getMcvCompletedTaskItem(info) {
  let icon_src = info.icon;
  let text = info.title;
  let deadline = Date(info.duetime);

  let box = document.createElement("div");
  box.className = "taskitemmcvcomplete";

  let front = document.createElement("div");
  front.style.display = "flex";
  let icon = document.createElement("img");
  icon.src = icon_src;
  icon.style = "width: 3vw;height: 3vw;";
  let title = document.createElement("div");
  title.style = "color: white;margin-left: 1.024vw; overflow-wrap: anywhere; width: 21vw;display: flex;align-items: center;justify-content: left;";
  let text_content = document.createElement('span');
  text_content.textContent = text;
  title.appendChild(text_content);
  front.appendChild(icon);
  front.appendChild(title);

  let deadline_box = getDeadlineBox(deadline);
  deadline_box.lastChild.style.color = '#646464';

  box.appendChild(front);
  box.appendChild(deadline);

  return box;
}

function closeCreatetask() {
  let createtask_box = document.getElementById("createtask_box");
  createtask_box.parentNode.removeChild(createtask_box);
}
function deleteCreatetaskTagbox(id) {
  let tagbox = document.getElementById(id);
  tagbox.parentNode.removeChild(tagbox);

  let selector = document.getElementById("createtask_tagselect");

  let tagoption = document.createElement("option");
  tagoption.textContent = tagbox.textContent.slice(0, -1);
  tagoption.id = id;
  let tags = selector.children;
  let found = false;
  for (let i = 0; i < tags.length; i++) {
    if (parseInt(tags[i].id.slice(8)) > parseInt(id.slice(8))) {
      selector.children[i].insertAdjacentElement('beforebegin', tagoption);
      found = true;
      break;
    }
  }
  if (!found) {
    selector.appendChild(tagoption);
  }
}
function getCreatetaskTagbox(text, id) {
  if (text > 15) {
    text = text.slice(0, 15) + "...";
  }
  let tagbox = document.createElement("div");
  tagbox.id = id;
  tagbox.className = "createtask_tagbox";


  let closebutton = document.createElement("div");
  closebutton.className = "createtask_tagclose";
  closebutton.onclick = function () { deleteCreatetaskTagbox(tagbox.id); }
  closebutton.textContent = "X";

  tagbox.textContent = text;
  tagbox.appendChild(closebutton);
  return tagbox;
}
function onchangeTagSelector() {
  let selector = document.getElementById("createtask_tagselect");
  let tag_select = selector.options[selector.selectedIndex].text;
  let new_tagbox = getCreatetaskTagbox(tag_select, selector.options[selector.selectedIndex].id);

  let taglist = document.getElementById("createtask_taglist");
  taglist.appendChild(new_tagbox);

  selector.remove(selector.selectedIndex);
  selector.selectedIndex = 0;

}
function getCreatetaskTagSelector(list) {
  let selector = document.createElement("select");
  selector.className = "createtask_select";
  selector.id = "createtask_tagselect";
  selector.onchange = function () {
    onchangeTagSelector()
  }
  let first_tagbox = document.createElement("option");
  first_tagbox.textContent = "Add Tag";
  first_tagbox.id = "cttagbox0";
  selector.appendChild(first_tagbox);
  let count = 1;
  list.forEach(i => {
    let tagbox = document.createElement("option");
    tagbox.id = "cttagbox" + count.toString();
    if (i.length > 20) {
      i = i.slice(0, 20) + "...";
    }
    tagbox.textContent = i;
    selector.appendChild(tagbox);
    count++;
  })

  return selector;
}
/* ---------------------------------------------------------- calendar thingy-----------------------------------------*/
var currDate = new Date();
var ctcurr_month = { value: currDate.getMonth() }
var ctcurr_year = { value: currDate.getFullYear() }
function regenerateCtCalendar(month, year) {
  let newcalendar = getCalendar(month, year);
  let calendar = document.getElementById("ctcalendar");
  let timeheader = document.getElementById("timeheader");
  if (calendar != null) {
    calendar.parentNode.removeChild(calendar);
  }
  timeheader.insertAdjacentElement('afterend', newcalendar);
}
function getCalendar(month, year) {
  let calendar = document.createElement('div')
  calendar.className = 'calendar';
  calendar.id = "ctcalendar";

  let calendar_header = document.createElement('div');
  calendar_header.className = "calendar-header";
  let insideheader = '<span class="month-picker" id="month-picker">April</span><div class="year-picker"><span class="year-change" id="ctprev-year"><</span><span id="year">2022</span><span class="year-change" id="ctnext-year">></span></div>';
  calendar_header.innerHTML = insideheader;

  let calendar_body = document.createElement('div');
  let insidebody = '<div class="calendar-week-day"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div></div><div class="calendar-days"></div>';
  calendar_body.innerHTML = insidebody;

  let month_list = document.createElement('div');
  month_list.className = "month-list";
  month_list.id = "month-list";

  calendar.appendChild(calendar_header);
  calendar.appendChild(calendar_body);
  calendar.appendChild(month_list);

  const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)
  }
  getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
  }
  function changeSelect(e) {
    // const last = document.querySelector('.curr-date');
    // last.classList.remove('curr-date');
    const last = document.querySelector('.ctselect-date');
    if (last != null) last.classList.remove('ctselect-date');

    e.currentTarget.classList.add('ctselect-date');
    console.log(this.innerHTML.substring(0, this.innerHTML.indexOf('<')))
    console.log(ctcurr_month.value + 1)
    console.log(ctcurr_year.value)
  }

  month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
      month_list.classList.remove('show')
      ctcurr_month.value = index
      regenerateCtCalendar(index, ctcurr_year.value)
    }
    month_list.appendChild(month)
  })
  month_picker = calendar.querySelector('#month-picker');
  month_picker.onclick = () => {
    month_list.classList.add('show')
  }

  let calendar_days = calendar.querySelector('.calendar-days')
  let calendar_header_year = calendar.querySelector('#year')

  let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  calendar_days.innerHTML = ''

  if (month > 11 || month < 0) month = currDate.getMonth()
  if (!year) year = currDate.getFullYear()

  month_picker.innerHTML = `${month_names[month]}`
  calendar_header_year.innerHTML = year

  // get first day of month

  let first_day = new Date(year, month, 1)

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement('div')
    if (i >= first_day.getDay()) {
      day.classList.add('calendar-day-cursor')
      day.classList.add('calendar-day-hover')
      day.innerHTML = i - first_day.getDay() + 1
      day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
      day.id = "ctday" + (i - first_day.getDay() + 1);
      if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
        day.classList.add('curr-date')
      }
      day.addEventListener('click', changeSelect);
    }
    calendar_days.appendChild(day)
  }

  calendar_header.querySelector('#ctprev-year').onclick = () => {
    --ctcurr_year.value
    regenerateCtCalendar(ctcurr_month.value, ctcurr_year.value)
  }
  calendar_header.querySelector('#ctnext-year').onclick = () => {
    ++ctcurr_year.value
    regenerateCtCalendar(ctcurr_month.value, ctcurr_year.value)
  }

  return calendar;
}
// ----------------------------------------------- end of calendar thingy -----------------------------


function getAllTagList() {
  return ["hello1", "hello2", "hello3", "hello4", "hello5"];
}
function openCreatetaskOverlay() {
  let taskpage = document.getElementById("taskpage");

  let line1 = document.createElement("hr");
  line1.style = "margin-top: 1%; margin-bottom: 1%";
  let line2 = document.createElement("hr");
  line2.style = "margin-top: 1%; margin-bottom: 1%";
  let line3 = document.createElement("hr");
  line3.style = "margin-top: 1%; margin-bottom: 1%";

  let createtask_box = document.createElement("div");
  createtask_box.id = "createtask_box";

  let header = document.createElement("div");
  header.id = "createtask_header";
  header.textContent = "Create Task";
  let close_button = document.createElement("img");
  close_button.src = "image/createtask_close.png";
  close_button.id = "createtask_close";
  close_button.onclick = function () { closeCreatetask(); closeScreenOverlay(); };
  header.appendChild(close_button);

  let name = document.createElement("input");
  name.id = "createtask_Name";
  name.placeholder = "Name";
  name.type = "text";

  let description = document.createElement("textarea");
  description.oninput = function () {
    this.style.height = "";
    this.style.height = this.scrollHeight + "px";
  }
  description.id = "createtask_Description";
  description.rows = 1;
  description.placeholder = "Description";

  let taglist = document.createElement("div");
  taglist.id = "createtask_taglist";
  let first_tagbox = document.createElement("div");
  first_tagbox.className = "createtask_tagbox";
  first_tagbox.textContent = "My task";
  taglist.appendChild(first_tagbox);

  let alltaglist = getAllTagList();
  let tagselector = getCreatetaskTagSelector(alltaglist);

  let timeheader = document.createElement("div");
  timeheader.style = "font-weight: bold; font-size: 1.4vw;";
  timeheader.textContent = "Time";
  timeheader.id = "timeheader";
  timeheader.style.margin = "4%";
  timeheader.style.marginLeft = 0;

  let calendar = document.createElement("div");
  calendar.id = "ctcalendar";

  let time = document.createElement("div");
  time.id = "createtask_time";
  let hour_select = document.createElement("select");
  hour_select.className = "createtask_select";
  hour_select.id = "cthour_select";
  let hourlist = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  hourlist.forEach(hour => {
    option = document.createElement("option");
    option.textContent = hour;
    hour_select.appendChild(option);
  })
  let minute_select = document.createElement("select");
  minute_select.className = "createtask_select";
  minute_select.id = "ctminute_select";
  let minutelist = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  minutelist.forEach(minute => {
    option = document.createElement("option");
    option.textContent = minute;
    minute_select.appendChild(option);
  })
  let colon = document.createElement("img");
  colon.src = "image/colon.png";
  colon.style = "width: 2.547vw; height: 2.547vw; margin-right: 1.5%;margin-top: 1.5%";
  time.appendChild(hour_select);
  time.appendChild(colon);
  time.appendChild(minute_select);

  let white_space = document.createElement("div");
  white_space.style = "height: 1.18vw;";

  let create_button = document.createElement("div");
  create_button.id = "createtask_createbutton";
  create_button.onclick = function () {
    createTask();
  }
  create_button.textContent = "Create";


  createtask_box.appendChild(header);
  createtask_box.appendChild(name);
  createtask_box.appendChild(line1);
  createtask_box.appendChild(description);
  createtask_box.appendChild(line2);
  createtask_box.appendChild(taglist);
  createtask_box.appendChild(tagselector);
  createtask_box.appendChild(line3);
  createtask_box.appendChild(timeheader);
  createtask_box.appendChild(calendar);
  createtask_box.appendChild(time);
  createtask_box.appendChild(white_space)
  createtask_box.appendChild(create_button);

  openScreenOverlay();
  taskpage.appendChild(createtask_box);
  ctcurr_month = { value: currDate.getMonth() }
  ctcurr_year = { value: currDate.getFullYear() }
  regenerateCtCalendar(ctcurr_month.value, ctcurr_year.value);
}
function createTask() {
  let task_name = document.getElementById("createtask_Name").value;
  let task_description = document.getElementById("createtask_Description").value;
  let tags = [];
  document.getElementById("createtask_taglist").querySelectorAll(".createtask_tagbox").forEach(tagbox => {
    tags.push(tagbox.textContent);
  });
  let calendar = document.getElementById("ctcalendar");
  let month = ctcurr_month.value;
  let year = ctcurr_year.value;
  let day = currDate.getDate();
  if (calendar.querySelector('.ctselect-date') != null) {
    day = parseInt(calendar.querySelector('.ctselect-date').id.slice(5));
  }
  let hour_select = document.getElementById("cthour_select");
  let hour = parseInt(hour_select.options[hour_select.selectedIndex].text)
  let minute_select = document.getElementById("ctminute_select");
  let minute = parseInt(minute_select.options[minute_select.selectedIndex].text)
  let due_date = new Date(year, month, day, hour, minute)
  console.log(due_date)

  let task = {
    task_name: task_name,
    task_description: task_description,
    tags: tags,
    due_date: due_date,
    task_status: false
  }
  addTask(task);

  closeCreatetask();
  closeScreenOverlay();
}


function openDetailtaskOverlay(info) {
  let id = info.task_id;

  let name = info.task_name;
  let tags = info.tags;
  let des = info.task_description
  let deadline = new Date(info.due_date);

  let now = new Date();

  let detailtask_box = document.createElement("div");
  detailtask_box.id = "detailtask";

  let top = document.createElement("div");

  let line1 = document.createElement("hr");
  line1.style = "width: 36.3vw; margin-top: 2%; margin-bottom: 2%";
  let line2 = document.createElement("hr");
  line2.style = "width: 36.3vw; margin-top: 2%; margin-bottom: 2%";
  let line3 = document.createElement("hr");
  line3.style = "width: 36.3vw; margin-top: 2%; margin-bottom: 2%";

  let headBox = document.createElement("div");
  headBox.style = "background-color: #D43F00; border-radius: 0.512vw 0.512vw 0px 0px; width: 100%; height: 0.985vw";
  if (now > deadline) {
    headBox.style.background = "#E63946";
  }
  else {
    headBox.style.background = "#49DFC4";
  }

  let header = document.createElement("div");
  header.id = "detailtask_header";
  header.textContent = name;
  let close_button = document.createElement("img");
  close_button.src = "image/createtask_close.png";
  close_button.id = "detailtask_close";
  close_button.onclick = function () {
    let detailtaskbox = document.getElementById("detailtask");
    closeScreenOverlay();
    document.body.removeChild(detailtaskbox);
  }
  header.appendChild(close_button);

  let taglist = document.createElement("div");
  taglist.id = "detailtask_taglist";

  if (tags != null) {
    tags.forEach(tag => {
      let tagbox = document.createElement("div");
      tagbox.className = "detailtask_tagbox";
      tagbox.textContent = tag;
      taglist.appendChild(tagbox);
    })
  }


  let description = document.createElement("div");
  description.id = "detailtask_description";
  description.textContent = des;

  let bottom = document.createElement("div");
  bottom.style = "display: flex; align-items: center;justify-content: space-between;padding: 1vw;";

  let time = document.createElement("div");
  time.id = "detailtask_deadline";
  time.textContent = getDateString(deadline);

  let delete_button = document.createElement("div");
  delete_button.id = "detailtask_delete";
  delete_button.onclick = function () {

    let detailtaskbox = document.getElementById("detailtask");
    closeScreenOverlay();
    document.body.removeChild(detailtaskbox);
    deleteTask(id);
  }
  let delete_content = document.createElement('p');
  delete_content.innerText = "Delete";
  delete_button.appendChild(delete_content);

  top.appendChild(headBox);
  top.appendChild(header);
  top.appendChild(line1);
  top.appendChild(taglist);
  top.appendChild(line2);
  top.appendChild(description);
  top.appendChild(line3);

  bottom.appendChild(time);
  bottom.appendChild(delete_button);

  detailtask_box.appendChild(top);
  detailtask_box.appendChild(bottom);

  openScreenOverlay();
  document.body.appendChild(detailtask_box);
}


function openDetailmcvtaskOverlay(info) {
  let now = new Date();
  let mcvtitle = info.course_title;

  let box = document.createElement("div");
  box.id = "mcvdetailtask"
  box.style = "width: 900px; height: 600px;";

  let top = document.createElement("div");

  let line1 = document.createElement("hr");
  line1.style = "width: 36.3vw; margin-top: 2%; margin-bottom: 2%";
  let line2 = document.createElement("hr");
  line2.style = "width: 36.3vw; margin-top: 2%; margin-bottom: 2%";

  let headBox = document.createElement("div");
  headBox.style = "border-radius: 0.512vw 0.512vw 0px 0px; width: 100%; min-height: 0.985vw";

  let header = document.createElement("div");
  header.id = "mcvdetailtask_header";
  if (now > Date(info.duetime)) {
    headBox.style.background = "#E63946";
  }
  else {
    headBox.style.background = "#49DFC4";
  }

  // let icon = document.createElement("div");
  // icon.style = "width: 3vw; height: 3vw; margin: 3%";
  let title = document.createElement("id");
  title.textContent = mcvtitle;
  let close_button = document.createElement("img");
  close_button.src = "image/createtask_close.png";
  close_button.id = "detailtask_close";
  close_button.onclick = function () {
    let detailtaskbox = document.getElementById("mcvdetailtask");
    document.body.removeChild(detailtaskbox);
    closeScreenOverlay();
  }

  // header.appendChild(icon);
  header.appendChild(title);
  header.appendChild(close_button);

  let desheader = document.createElement("p");
  desheader.id = "mcvdetailtask_desheader";
  desheader.textContent = info.title;

  let des = document.createElement('div');
  des.className = "mcvdetailtask_des"
  des.innerHTML = info.instruction;

  let bottom = document.createElement("div");
  bottom.style = "display: flex; align-items: center;justify-content: space-between;padding: 1vw";

  let time = document.createElement("div");
  time.id = "detailtask_deadline";
  let text = document.createElement("p");
  text.textContent = getDateString(new Date(info.duetime));

  top.appendChild(headBox);
  top.appendChild(header);
  top.appendChild(line1);
  top.appendChild(des);
  top.appendChild(line2);

  bottom.appendChild(time);

  box.appendChild(top);
  box.appendChild(bottom);

  openScreenOverlay();
  document.body.appendChild(box);
}



///////////////////////datebox////////////////////////
var color = {
  "Sun": "#FFB2AD",
  "Fri": "#ADD8FF",
  "Mon": "#FDFFAD",
  "Wed": "#D1FFAD",
  "Sat": "#BEADFF",
  "Tue": "#FFADDE",
  "Thu": "#FFD4AD",
}
var colordaybefore = {
  "Tue": "#FDFFAD",
  "Wed": "#FFADDE",
  "Thu": "#D1FFAD",
  "Fri": "#FFD4AD",
  "Sun": "#ADD8FF",
  "Sat": "#FFB2AD",
  "Mon": "#BEADFF",
}
var colordayafter = {
  "Sun": "#FDFFAD",
  "Mon": "#FFADDE",
  "Tue": "#D1FFAD",
  "Wed": "#FFD4AD",
  "Thu": "#ADD8FF",
  "Fri": "#BEADFF",
  "Sat": "#FFB2AD",
}


function addrotate() {
  const h = document.getElementById("fsq1");
  const r = document.getElementById("fsq2");
  const month = document.getElementById("monthchange");
  const date = document.getElementById("daynumberchange");
  const weekday = document.getElementById("weekdaychange");
  const colorlast = document.getElementById("fsq2")
  const colorone = document.getElementById("ffsq2")

  const rmonth = document.getElementById("month");
  const rweekday = document.getElementById("weekday");
  const rdaynum = document.getElementById("daynumber");

  r.classList.remove("rotatere")
  r.style.animationPlayState = "end"
  h.classList.add("rotate");

  function change() {
    const { backDate, backMonth, backweekday } = getBackDateAndMonth(date.innerText, month.innerText, weekday.innerText);
    date.innerText = backDate;
    month.innerText = backMonth;
    weekday.innerText = backweekday;

    rweekday.innerText = backweekday;
    rdaynum.innerText = backDate;
    rmonth.innerText = backMonth;
    colorlast.style.backgroundColor = color[weekday.innerText];
    colorone.style.backgroundColor = colordayafter[weekday.innerText];
  }
  h.addEventListener("animationiteration", change);

  h.addEventListener("animationend", () => {
    colorlast.style.backgroundColor = color[weekday.innerText];
    colorone.style.backgroundColor = colordayafter[weekday.innerText];
    h.removeEventListener("animationiteration", change);
    h.classList.remove("rotate");
  }, { once: true });

}
function addrotatere() {
  const colorlast = document.getElementById("fsq2")
  const colorone = document.getElementById("ffsq2")
  const h = document.getElementById("fsq1");
  const month = document.getElementById("monthchange");
  const date = document.getElementById("daynumberchange");
  const weekday = document.getElementById("weekdaychange");

  const rmonth = document.getElementById("month");
  const rweekday = document.getElementById("weekday");
  const rdaynum = document.getElementById("daynumber");
  const r = document.getElementById("fsq2");
  h.classList.remove("rotate");
  h.style.animationPlayState = "end";
  r.classList.add("rotatere");

  async function change() {

    const { nextDate, nextMonth, nextweekday } = getNextDateAndMonth(date.innerText, month.innerText, weekday.innerText);
    date.innerText = nextDate;
    month.innerText = nextMonth;
    weekday.innerText = nextweekday;
    rmonth.innerText = nextMonth;
    rweekday.innerText = nextweekday;
    rdaynum.innerText = nextDate;
    colorlast.style.backgroundColor = colordaybefore[nextweekday];
    colorone.style.backgroundColor = color[nextweekday];
  }
  r.addEventListener("animationiteration", change);

  r.addEventListener("animationend", () => {
    colorlast.style.backgroundColor = color[weekday.innerText];
    colorone.style.backgroundColor = colordayafter[weekday.innerText];
    r.removeEventListener("animationiteration", change);
    r.classList.remove("rotatere");
  }, { once: true });

}
function getNextDateAndMonth(date, smonth, weekday) {
  const monthToNumber = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  };

  const numberToMonth = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
  };

  month = monthToNumber[smonth];
  arr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let index = arr.findIndex((element) => { return element == weekday });
  let nextweekday = arr[(index + 1) % 7];
  let ranint = Math.floor(Math.random() * ((31 - 1) + 1))
  const dateObj = new Date(null, month - 1, date);
  dateObj.setDate(dateObj.getDate() + ranint);
  const nextDate = dateObj.getDate();

  const nextMonth = numberToMonth[dateObj.getMonth() + 1];
  return { nextDate, nextMonth, nextweekday };
}
function getBackDateAndMonth(date, smonth, weekday) {
  const monthToNumber = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  };

  const numberToMonth = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
  };
  month = monthToNumber[smonth];
  arr = ["Sun", "Sat", "Fri", "Thu", "Wed", "Tue", "Mon"];
  let index = arr.findIndex((element) => { return element == weekday });
  let backweekday = arr[(index + 1) % 7];
  const dateObj = new Date(null, month - 1, date);
  let ranint = Math.floor(Math.random() * ((31 - 1) + 1))
  dateObj.setDate(dateObj.getDate() - ranint);
  const backDate = dateObj.getDate();
  const backMonth = numberToMonth[dateObj.getMonth() + 1];
  return { backDate, backMonth, backweekday };
}
/////////////////////////datebox///////////////////////
function getDateString(date) {
  const monthname = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let day = date.getDate() <= 9 ? "0" + date.getDate().toString() : date.getDate().toString();
  let month = monthname[date.getMonth()];
  let year = date.getFullYear().toString();
  let hour = date.getHours().toString();
  let minute = date.getMinutes().toString();
  return day + " " + month + " " + year + "   " + hour + ":" + minute;
}

function getTaskInfo(id) {

let calendar = document.querySelector('.calendar')

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)
}

getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28
}

function changeSelect(e) {
  // const last = document.querySelector('.curr-date');
  // last.classList.remove('curr-date');
  // const last = document.querySelector('.select-date');
  // if (last != null) last.classList.remove('select-date');


  console.log(this.innerHTML.substring(0, this.innerHTML.indexOf('<')));
  console.log(e.innerText)
  console.log(curr_month.value + 1)
  console.log(curr_year.value)
}


generateCalendar = (month, year) => {

  let calendar_days = calendar.querySelector('.calendar-days')
  let calendar_header_year = calendar.querySelector('#year')

  let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  calendar_days.innerHTML = ''

  let currDate = new Date()
  if (month > 11 || month < 0) month = currDate.getMonth()
  if (!year) year = currDate.getFullYear()

  let curr_month = `${month_names[month]}`
  month_picker.innerHTML = curr_month
  calendar_header_year.innerHTML = year

  // get first day of month

  let first_day = new Date(year, month, 1)

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement('div')
    if (i >= first_day.getDay()) {
      day.classList.add('calendar-days-hover')
      day.innerHTML = i - first_day.getDay() + 1
      if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
        day.classList.add('curr-date')
      }
      day.onclick = function () {
        changeSelect(this);
      };
    }
    calendar_days.appendChild(day)
  }
  // var days = document.getElementsByClassName("calendar-days");
  // console.log(calendar_days.length);
  // for (var i = 0; i < calendar_days.length; i++) {
  //     console.log(calendar_days.length);
  //     console.log(calendar_days[i])
  //     calendar_days[i].addEventListener('click', changeSelect);
  // }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
  let month = document.createElement('div')
  month.innerHTML = `<div data-month="${index}">${e}</div>`
  month.querySelector('div').onclick = () => {
    month_list.classList.remove('show')
    curr_month.value = index
    generateCalendar(index, curr_year.value)
  }
  month_list.appendChild(month)
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
  month_list.classList.add('show')
}

let currDate = new Date()

let curr_month = { value: currDate.getMonth() }
let curr_year = { value: currDate.getFullYear() }

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
  --curr_year.value
  generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
  ++curr_year.value
  generateCalendar(curr_month.value, curr_year.value)
}


const Today_btn = document.getElementById("Today");
const Today_num = document.getElementById("Today_cnt");
const All_Tasks_btn = document.getElementById("All_Tasks");
const All_Tasks_num = document.getElementById("All_Tasks_cnt");
const Completed_btn = document.getElementById("Completed");
const Completed_num = document.getElementById("Completed_cnt");
// const text = document.getElementById("text");
let numberTask = 5;

const c1 = hexToRgb("#F1FAFE");
const c2 = hexToRgb("#A6E4FF");

function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function changeColor(button) {
  let sidebarbuttons = [...document.getElementsByClassName("myButton")];
  button.classList.toggle("clicked");
  button.style.backgroundColor = c2;
  sidebarbuttons.forEach((b) => {
    if (b.getAttribute("id") != button.getAttribute("id")) {
      b.classList.remove("clicked");
      b.style.backgroundColor = c1;
    }
  });
}

function PageChange(button) {
  button.lastElementChild.lastElementChild.innerHTML = numberTask;
}

Today_btn.onclick = function () {
  changeColor(this);
  PageChange(this)
}
All_Tasks_btn.onclick = function () {
  changeColor(this);
  PageChange(this)
}
Completed_btn.onclick = function () {
  changeColor(this);
  PageChange(this)
}

function openScreenOverlay() {
  let screenOverlay = document.createElement("div");
  screenOverlay.className = "overlay_screen";
  document.body.appendChild(screenOverlay);
}
function closeScreenOverlay() {
  document.querySelectorAll(".overlay_screen").forEach(overlay => {
    document.body.removeChild(overlay);
  });
}


function openAddFilterOverlay() {
  const container = document.createElement("div");
  container.id = "newfilter-container";

  const closeButton = document.createElement("img");
  closeButton.src = "createtask_close.png";
  closeButton.id = "close-addfilter-btn";
  closeButton.onclick = function () {
    document.body.removeChild(container);
    closeScreenOverlay();
  }
  container.appendChild(closeButton);

  const filterText = document.createElement("div");
  filterText.id = "filter-text";
  filterText.textContent = "New Filter";
  container.appendChild(filterText);

  const filterInput = document.createElement("input");
  filterInput.id = "filter";
  filterInput.type = "text";
  filterInput.placeholder = "Filter Name";
  container.appendChild(filterInput);

  const buttonContainer = document.createElement("div");
  buttonContainer.id = "button-container";
  const addButton = document.createElement("button");
  addButton.id = "addfilter-button";
  addButton.textContent = "Add";
  addButton.onclick = function () {
    let filter = document.getElementById("filter").value;
    let checkbox_container = document.getElementById("checkbox-container");
    let checkbox_content = document.createElement('div')
    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let iconPath1 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    let iconPath2 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    icon.style.marginLeft = '0.2vw'
    icon.style.marginRight = '0.3vw'
    icon.setAttribute('width', '16.5')
    icon.setAttribute('height', '21')
    icon.setAttribute('viewBox', '0 0 22 28');
    icon.setAttribute('fill', 'none')
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    iconPath1.setAttribute('d', 'M6.75002 13.4844C7.10807 13.4844 7.45144 13.3428 7.70462 13.0908C7.95779 12.8388 8.10002 12.497 8.10002 12.1406C8.10002 11.7843 7.95779 11.4425 7.70462 11.1905C7.45144 10.9385 7.10807 10.7969 6.75002 10.7969C6.39198 10.7969 6.0486 10.9385 5.79543 11.1905C5.54226 11.4425 5.40002 11.7843 5.40002 12.1406C5.40002 12.497 5.54226 12.8388 5.79543 13.0908C6.0486 13.3428 6.39198 13.4844 6.75002 13.4844ZM9.45002 12.1406C9.45002 11.7843 9.59226 11.4425 9.84543 11.1905C10.0986 10.9385 10.442 10.7969 10.8 10.7969H14.85C15.2081 10.7969 15.5514 10.9385 15.8046 11.1905C16.0578 11.4425 16.2 11.7843 16.2 12.1406C16.2 12.497 16.0578 12.8388 15.8046 13.0908C15.5514 13.3428 15.2081 13.4844 14.85 13.4844H10.8C10.442 13.4844 10.0986 13.3428 9.84543 13.0908C9.59226 12.8388 9.45002 12.497 9.45002 12.1406ZM10.8 14.8282C10.442 14.8282 10.0986 14.9698 9.84543 15.2218C9.59226 15.4738 9.45002 15.8156 9.45002 16.172C9.45002 16.5284 9.59226 16.8702 9.84543 17.1222C10.0986 17.3742 10.442 17.5157 10.8 17.5157H14.85C15.2081 17.5157 15.5514 17.3742 15.8046 17.1222C16.0578 16.8702 16.2 16.5284 16.2 16.172C16.2 15.8156 16.0578 15.4738 15.8046 15.2218C15.5514 14.9698 15.2081 14.8282 14.85 14.8282H10.8ZM10.8 18.8595C10.442 18.8595 10.0986 19.0011 9.84543 19.2531C9.59226 19.5051 9.45002 19.8469 9.45002 20.2033C9.45002 20.5597 9.59226 20.9015 9.84543 21.1535C10.0986 21.4055 10.442 21.5471 10.8 21.5471H14.85C15.2081 21.5471 15.5514 21.4055 15.8046 21.1535C16.0578 20.9015 16.2 20.5597 16.2 20.2033C16.2 19.8469 16.0578 19.5051 15.8046 19.2531C15.5514 19.0011 15.2081 18.8595 14.85 18.8595H10.8ZM8.10002 16.172C8.10002 16.5284 7.95779 16.8702 7.70462 17.1222C7.45144 17.3742 7.10807 17.5157 6.75002 17.5157C6.39198 17.5157 6.0486 17.3742 5.79543 17.1222C5.54226 16.8702 5.40002 16.5284 5.40002 16.172C5.40002 15.8156 5.54226 15.4738 5.79543 15.2218C6.0486 14.9698 6.39198 14.8282 6.75002 14.8282C7.10807 14.8282 7.45144 14.9698 7.70462 15.2218C7.95779 15.4738 8.10002 15.8156 8.10002 16.172ZM6.75002 21.5471C7.10807 21.5471 7.45144 21.4055 7.70462 21.1535C7.95779 20.9015 8.10002 20.5597 8.10002 20.2033C8.10002 19.8469 7.95779 19.5051 7.70462 19.2531C7.45144 19.0011 7.10807 18.8595 6.75002 18.8595C6.39198 18.8595 6.0486 19.0011 5.79543 19.2531C5.54226 19.5051 5.40002 19.8469 5.40002 20.2033C5.40002 20.5597 5.54226 20.9015 5.79543 21.1535C6.0486 21.4055 6.39198 21.5471 6.75002 21.5471Z')
    iconPath1.setAttribute('fill', '#0D0D0D')

    iconPath2.setAttribute('d', 'M6.75 0.71875C6.39196 0.71875 6.04858 0.860326 5.79541 1.11233C5.54223 1.36434 5.4 1.70613 5.4 2.06252H2.7C1.98392 2.06252 1.29716 2.34567 0.790812 2.84969C0.284463 3.3537 0 4.03729 0 4.75007V24.9067C0 25.6194 0.284463 26.303 0.790812 26.807C1.29716 27.3111 1.98392 27.5942 2.7 27.5942H18.9C19.6161 27.5942 20.3028 27.3111 20.8092 26.807C21.3155 26.303 21.6 25.6194 21.6 24.9067V4.75007C21.6 4.03729 21.3155 3.3537 20.8092 2.84969C20.3028 2.34567 19.6161 2.06252 18.9 2.06252H16.2C16.2 1.70613 16.0578 1.36434 15.8046 1.11233C15.5514 0.860326 15.208 0.71875 14.85 0.71875H6.75ZM16.2 4.75007H18.9V24.9067H2.7V4.75007H5.4V6.09384C5.4 6.45023 5.54223 6.79203 5.79541 7.04403C6.04858 7.29604 6.39196 7.43761 6.75 7.43761H14.85C15.208 7.43761 15.5514 7.29604 15.8046 7.04403C16.0578 6.79203 16.2 6.45023 16.2 6.09384V4.75007ZM8.1 4.75007V3.4063H13.5V4.75007H8.1Z')
    iconPath2.setAttribute('fill', '#0D0D0D')

    let checkbox = document.createElement('input');

    checkbox_content.id = "checkbox-content"
    checkbox.type = "checkbox";
    checkbox.className = "filter_checkbox";
    checkbox.id = filter;
    checkbox.name = filter;
    checkbox.value = filter;

    let label = document.createElement('label')
    label.innerText = filter;

    icon.appendChild(iconPath1)
    icon.appendChild(iconPath2)
    checkbox_content.appendChild(checkbox);
    checkbox_content.appendChild(icon)
    checkbox_content.appendChild(label);
    checkbox_container.appendChild(checkbox_content);
    document.body.removeChild(container);
    closeScreenOverlay();
  }
  buttonContainer.appendChild(addButton);
  container.appendChild(buttonContainer);
  openScreenOverlay();
  document.body.appendChild(container);
}



}