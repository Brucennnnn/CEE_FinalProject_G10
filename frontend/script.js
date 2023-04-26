function generateRandomId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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

function handleCheckboxChange(checkbox){
  if(checkbox.checked){
    console.log(checkbox.id)//change to add in below list
  }
}

function renderTaskpage(date,tags,tasks) {
  let taskpage = document.createElement("div");
  taskpage.id = "taskpage";

  let header = document.createElement("div");
  header.id = "taskpage_header"
  let title = document.createElement("div");
  title.textContent = date == currDate ? "Today" : getDateString(date);
  let createtask_button = document.createElement("img");
  createtask_button.src = "image/createtask_button.png";
  createtask_button.id = "createtask_button"
  createtask_button.onclick = function() {
    openCreatetaskOverlay()
  }
  
  let taglist = document.createElement("div");
  taglist.id = "taglist";
  tags.forEach(tag => {
    let tagbox = document.createElement("div");
    tagbox.className = "tagbox";
    tagbox.textContent = tag;
    taglist.appendChild(tagbox);
  })

  let tasklist = document.createElement("div");
  tasklist.id = "tasklist";
  tasks.forEach(task=> {
    let taskbox = getTaskItem(task.id,task.name,task.outdate);
    tasklist.appendChild(taskbox);
  })

  taskpage.appendChild(header);
  taskpage.appendChild(taglist);
  taskpage.appendChild(tasklist);

  let oldtaskpage = document.getElementById("taskpage");
  if(oldtaskpage != null) {
    oldtaskpage.parentNode.remove(oldtaskpage);
  }
  document.body.appendChild(taskpage);
}

function renderCompleteTaskpage() {

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
    inp.onclick="event.stopPropagation();"


    const di = document.createElement('div');
    di.className='checkbox_box';
    di.onclick="event.stopPropagation();"
    
    la.appendChild(inp);
    la.appendChild(di);
    return la
}

function getTaskItem(id, text, outdate) {
  if(text.length > 100) {
    text = text.slice(0,100) + "...";
  }
  let taskitem = document.createElement("div");
  taskitem.className = "taskitem"
  taskitem.id = id;

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

  let selector = document.getElementById("createtask_tagselect");

  let tagoption = document.createElement("option");
  tagoption.textContent = tagbox.textContent.slice(0,-1);
  tagoption.id = id;
  let tags = selector.children;
  let found = false;
  for(let i = 0 ;i < tags.length;i++) {
    if(parseInt(tags[i].id.slice(8)) > parseInt(id.slice(8))) {
      selector.children[i].insertAdjacentElement('beforebegin',tagoption);
      found = true;
      break;
    }
  }
  if(!found) {
    selector.appendChild(tagoption);
  }
}
function getCreatetaskTagbox(text,id) {
  if(text > 15) {
    text = text.slice(0,15) + "...";
  }
  let tagbox = document.createElement("div");
  tagbox.id = id;
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
  let new_tagbox = getCreatetaskTagbox(tag_select,selector.options[selector.selectedIndex].id);

  let taglist = document.getElementById("createtask_taglist");
  taglist.appendChild(new_tagbox);
  
  selector.remove(selector.selectedIndex);
  selector.selectedIndex = 0;
  
}
function getCreatetaskTagSelector(list) {
  let selector = document.createElement("select");
  selector.className = "createtask_select";
  selector.id = "createtask_tagselect";
  selector.onchange = function() {
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
    if(i.length > 20) {
      i = i.slice(0,20) + "...";
    }
    tagbox.textContent = i;
    selector.appendChild(tagbox);
    count++;
  })

  return selector;
}
/* ---------------------------------------------------------- calendar thingy-----------------------------------------*/
let currDate = new Date()
let ctcurr_month = {value: currDate.getMonth()}
let ctcurr_year = {value: currDate.getFullYear()}
function regenerateCtCalendar(month, year) {
  let newcalendar = getCalendar(month, year);
  let calendar = document.getElementById("ctcalendar");
  let timeheader = document.getElementById("timeheader");
  if(calendar != null){
    calendar.parentNode.removeChild(calendar);
  }
  timeheader.insertAdjacentElement('afterend',newcalendar);
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
        console.log(ctcurr_month.value+1)
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
  return ["hello1","hello2","hello3","hello4","hello5"];
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
  close_button.onclick = function() {closeCreatetask();closeScreenOverlay();};
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
  create_button.onclick = function() {
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
  ctcurr_month = {value: currDate.getMonth()}
  ctcurr_year = {value: currDate.getFullYear()}
  regenerateCtCalendar(ctcurr_month.value, ctcurr_year.value);
}
function createTask(){
  let name = document.getElementById("createtask_Name").value;
  let description = document.getElementById("createtask_Description").value;
  let tags = [];
  document.getElementById("createtask_taglist").querySelectorAll(".createtask_tagbox").forEach(tagbox =>{
    tags.push(tagbox.textContent);
  });
  let calendar = document.getElementById("ctcalendar");
  let month = ctcurr_month.value;
  let year = ctcurr_year.value;
  let day = currDate.getDate();
  if(calendar.querySelector('.ctselect-date') != null) {
    day = parseInt(calendar.querySelector('.ctselect-date').id.slice(5));
  }
  let hour_select = document.getElementById("cthour_select");
  let hour = parseInt(hour_select.options[hour_select.selectedIndex].text)
  let minute_select = document.getElementById("ctminute_select");
  let minute = parseInt(minute_select.options[minute_select.selectedIndex].text)
  let time = new Date(year,month,day,hour,minute)

  console.log(name,description,tags,time)

  closeCreatetask();
  closeScreenOverlay();
}

function openDetailtaskOverlay(name,des,tags,outdate) {
  let now = new Date();

  let detailtask_box = document.createElement("div");
  detailtask_box.id = "detailtask";

  let line1 = document.createElement("hr");
  line1.style = "width: 36.3vw; margin-top: 2%; margin-bottom: 2%";
  let line2 = document.createElement("hr");
  line2.style = "width: 36.3vw; margin-top: 2%; margin-bottom: 2%";
  let line3 = document.createElement("hr");
  line3.style = "width: 36.3vw; margin-top: 2%; margin-bottom: 2%";

  let headBox = document.createElement("div");
  headBox.style = "border-radius: 0.512vw 0.512vw 0px 0px; width: 100%; height: 3.5vw";
  if(now > outdate) {
    headBox.style.background = "#D43F00";
  }
  else {
    headBox.style.background = "#1ED400";
  }
  
  let header = document.createElement("div");
  header.id = "detailtask_header";
  header.textContent = name;
  let close_button = document.createElement("img");
  close_button.src = "image/createtask_close.png";
  close_button.id = "detailtask_close";
  close_button.onclick = function() {
    let detailtaskbox = document.getElementById("detailtask");
    document.body.removeChild(detailtaskbox);
    closeScreenOverlay();
  }
  header.appendChild(close_button);

  let taglist = document.createElement("div");
  taglist.id = "detailtask_taglist";
  tags.forEach(tag => {
    let tagbox = document.createElement("div");
    tagbox.className = "detailtask_tagbox";
    tagbox.textContent = tag;
    taglist.appendChild(tagbox);
  })

  let description = document.createElement("div");
  description.id = "detailtask_description";
  description.textContent = des;

  let time = document.createElement("div");
  time.id = "detailtask_deadline";
  time.textContent = getDateString(now);

  detailtask_box.appendChild(headBox);
  detailtask_box.appendChild(header);
  detailtask_box.appendChild(line1);
  detailtask_box.appendChild(taglist);
  detailtask_box.appendChild(line2);
  detailtask_box.appendChild(description);
  detailtask_box.appendChild(line3);
  detailtask_box.appendChild(time);
  
  openScreenOverlay();
  document.body.appendChild(detailtask_box);
}

function getDateString(date) {
  const monthname = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let day = date.getDay() <= 9 ? "0" + date.getDay().toString() : date.getDay().toString();
  let month = monthname[date.getMonth()];
  let year = date.getFullYear().toString();
  let hour = date.getHours().toString();
  let minute = date.getMinutes().toString();
  return day + " " + month + " " + year + "   " + hour + ":" + minute;
}