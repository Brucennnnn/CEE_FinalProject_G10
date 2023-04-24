
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

  taskitem.appendChild(front);
  taskitem.appendChild(back);
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

function closeCreatetask() {
  let createtask_box = document.getElementById("createtask_box");
  createtask_box.parentNode.removeChild(createtask_box);
}
function getTagbox(text) {
  if(text.length > 40) {
    text = text.slice(0,40) + "...";
  }

  let tagBox = document.createElement("div");
  tagBox.className = "tagbox";
  tagBox.textContent = text;
  return tagBox;
}
function deleteCreatetaskTagbox(id) {
  let tagbox = document.getElementById(id);
  tagbox.parentNode.removeChild(tagbox);
}
function getCreatetaskTagbox(text) {
  if(text > 15) {
    text = text.slice(0,15) + "...";
  }
  let tagbox = document.createElement("div");
  tagbox.id = generateRandomId(10);
  tagbox.className = "createtask_tagbox";

  let closebutton = document.createElement("div");
  closebutton.className = "createtask_tagclose";
  closebutton.onclick = function() {deleteCreatetaskTagbox(tagbox.id);}
  closebutton.textContent = "X";
  
  tagbox.textContent = text;
  tagbox.appendChild(closebutton);
  return tagbox;
}
function onchangeTagSelector() {
  let selector = document.getElementById("createtask_tagselect");
  let tag_select = selector.options[selector.selectedIndex].text;
  let new_tagbox = getCreatetaskTagbox(tag_select);

  let taglist = document.getElementById("createtask_taglist");
  taglist.appendChild(new_tagbox);

  selector.selectedIndex = 0;
}
function getCreatetaskSelector(list) {
  let selector = document.createElement("select");
  selector.className = "createtask_select";
  selector.id = "createtask_tagselect";
  selector.onchange = function() {
    onchangeTagSelector()
  }
  let first_tagbox = document.createElement("option");
  first_tagbox.textContent = "Add Tag";
  selector.appendChild(first_tagbox);
  for(i in list) {
    let tagbox = document.createElement("option");
    selector.appendChild(tagbox);
  }

  return selector;
}
/* ---------------------------------------------------------- calendar thingy-----------------------------------------*/
let currDate = new Date()
let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}
function regenerateCtCalendar(month, year) {
  let newcalendar = getCalendar(month, year);
  let calendar = document.getElementById("ctcalendar");
  calendar.appendChild(newcalendar);
}
function getCalendar(month, year) {
    let calendar = document.createElement('div')
    calendar.className = 'calendar';

    let calendar_header = document.createElement('div');
    calendar_header.className = "calendar-header";
    let insideheader = '<span class="month-picker" id="month-picker">April</span><div class="year-picker"><span class="year-change" id="ctprev-year"><pre><</pre></span><span id="year">2022</span><span class="year-change" id="ctnext-year"><pre>></pre></span></div>';
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
        return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
    }
    getFebDays = (year) => {
        return isLeapYear(year) ? 29 : 28
    }
    function changeSelect(e){
        // const last = document.querySelector('.curr-date');
        // last.classList.remove('curr-date');
        const last = document.querySelector('.ctselect-date');
        if(last != null) last.classList.remove('ctselect-date');

        e.currentTarget.classList.add('ctselect-date');
        console.log(this.innerHTML.substring(0, this.innerHTML.indexOf('<')))
        console.log(curr_month.value+1)
        console.log(curr_year.value)
    }

    month_names.forEach((e, index) => {
        let month = document.createElement('div')
        month.innerHTML = `<div data-month="${index}">${e}</div>`
        month.querySelector('div').onclick = () => {
            month_list.classList.remove('show')
            curr_month.value = index
            regenerateCtCalendar(index, curr_year.value)
        }
        month_list.appendChild(month)
    })
    month_picker = calendar.querySelector('.month-picker');
    month_picker.onclick = () => {
        month_list.classList.add('show')
    }

    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

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
            day.classList.add('calendar-day-hover')
            day.innerHTML = i - first_day.getDay() + 1
            day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date')
            }
        }
        day.addEventListener('click', changeSelect);
        calendar_days.appendChild(day)
    }
    // var days = document.getElementsByClassName("calendar-days");
    // console.log(calendar_days.length);
    // for (var i = 0; i < calendar_days.length; i++) {
    //     console.log(calendar_days.length);
    //     console.log(calendar_days[i])
    //     calendar_days[i].addEventListener('click', changeSelect);
    // }

    calendar_header.querySelector('#ctprev-year').onclick = () => {
      --ctcurr_year.value
      regenerateCtCalendar(curr_month.value, curr_year.value)
    }
    calendar_header.querySelector('#ctnext-year').onclick = () => {
      ++ctcurr_year.value
      regenerateCtCalendar(curr_month.value, curr_year.value)
    }

    return calendar;
}
// ----------------------------------------------- end of calendar thingy -----------------------------


function getAllTagList(){
  // return list of string of every tag
}
function openCreatetaskOverlay() {
  let taskpage = document.getElementById("taskpage");

  let createtask_box = document.createElement("div");
  createtask_box.id = "createtask_box";

  let header = document.createElement("div");
  header.id = "createtask_header";
  header.textContent = "Create Task";
  let close_button = document.createElement("img");
  close_button.src = "image/createtask_close.png";
  close_button.id = "createtask_close";
  close_button.onclick = function() {closeCreatetask()};
  header.appendChild(close_button);

  let name = document.createElement("input");
  name.id = "createtask_Name";
  name.placeholder = "Name";
  name.type = "text";

  let description = document.createElement("textarea");
  description.oninput = function() {
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
  let tagselector = getCreatetaskSelector(alltaglist);
  
  let timeheader = document.createElement("div");
  timeheader.style = "font-weight: bold; font-size: 1vw;";
  timeheader.textContent = "Time";

  let calendar = document.createElement("div");
  calendar.id = "ctcalendar";

  createtask_box.appendChild(header);
  createtask_box.appendChild(name);
  createtask_box.appendChild(document.createElement("hr"));
  createtask_box.appendChild(description);
  createtask_box.appendChild(document.createElement("hr"));
  createtask_box.appendChild(taglist);
  createtask_box.appendChild(tagselector);
  createtask_box.appendChild(document.createElement("hr"));
  createtask_box.appendChild(timeheader);
  createtask_box.appendChild(calendar);
  

  taskpage.appendChild(createtask_box);
  regenerateCtCalendar(curr_month.value, curr_year.value);
}