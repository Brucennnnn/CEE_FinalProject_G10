function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
  
    if (taskText === '') {
      alert('Please enter a task.');
      return;
    }
  
    const taskList = document.getElementById('taskList');
    const newTask = document.createElement('div');
    newTask.className='list-item'
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
    newTask.appendChild(la);
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    newTask.appendChild(taskSpan);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
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


function handleCheckboxChange(checkbox){
  if(checkbox.checked){
    console.log(checkbox.id)//change to add in below list
  }
}

let calendar = document.querySelector('.calendar')

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

function changeSelect(e){
    // const last = document.querySelector('.curr-date');
    // last.classList.remove('curr-date');
    const last = document.querySelector('.select-date');
    if(last != null) last.classList.remove('select-date');

    e.currentTarget.classList.add('select-date');
    console.log(this.innerHTML.substring(0, this.innerHTML.indexOf('<')))
    console.log(curr_month.value+1)
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
            day.addEventListener('click', changeSelect);
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

let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}


const button = document.getElementById("myButton");
const circle = document.getElementById("circle");
const circleNumber = document.getElementById("circle-number");
const text = document.getElementById("text");
let numberTask = 0;

const c1 = "white";
const c2 = "#A6E4FF";

// circle.appendChild(circleNumber);
// circleNumber.innerHTML = numberTask;

// button.appendChild(circle);
// button.appendChild(text);

function changeColor() {
    button.classList.toggle("clicked");
    circle.classList.toggle("clicked");
    if (button.style.backgroundColor === c1) {
      button.style.backgroundColor = c2;
    } else {
      button.style.backgroundColor = c1;
    }
}

function PageChange() {
  circleNumber.innerHTML = numberTask;
}

button.addEventListener("click", changeColor);
button.addEventListener("click", PageChange);
