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


