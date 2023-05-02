// import {PUBLIC_IP_ADDRESS} from "./env.js";
var activeFilters = []
const IP_ADDRESS = '44.215.207.206'

function setDisabled(loading) {
  [...document.getElementsByClassName("myButton")].forEach(button => {
    button.style.pointerEvents = loading ? "none" : "auto";
  })
}

async function addTask(task) {
  Object.assign(task, { status: false })
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task)
  };
  await fetch(`http://${IP_ADDRESS}:3000/task/addTask`, options)
    .then(res => res.json())
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

async function logout() {
  const options = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  }
  console.log("logout")
  await fetch(`http://${IP_ADDRESS}:3000/courseville/logout`, options).then(res => console.log(res)).catch(err => console.log(err));
  location.reload();
}

window.onload = async function getAllTask() {
  let me = false;
  try {
    const options = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    }
    me = await fetch(`http://${IP_ADDRESS}:3000/courseville/me`, options).then(res => res.status).catch(err => console.log("is not login"));
  } catch (error) {
    console.log("is not login")
    // document.body.innerHTML = `<h1>Please Login First</h1>`
  }
  console.log(me);
  if (me === 200) {
    const options = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    }
    console.log("login success")
    document.getElementById("profile-header").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <g transform="translate(50 50)">
    <g transform="scale(1)">
    <g transform="translate(-50 -50)">
    <g>
    <animateTransform attributeName="transform" type="translate" repeatCount="indefinite" dur="1s" values="-20 -20;20 -20;0 20;-20 -20" keyTimes="0;0.33;0.66;1"></animateTransform>
    <path fill="#667395" d="M44.19 26.158c-4.817 0-9.345 1.876-12.751 5.282c-3.406 3.406-5.282 7.934-5.282 12.751 c0 4.817 1.876 9.345 5.282 12.751c3.406 3.406 7.934 5.282 12.751 5.282s9.345-1.876 12.751-5.282 c3.406-3.406 5.282-7.934 5.282-12.751c0-4.817-1.876-9.345-5.282-12.751C53.536 28.033 49.007 26.158 44.19 26.158z"></path>
    <path fill="#292664" d="M78.712 72.492L67.593 61.373l-3.475-3.475c1.621-2.352 2.779-4.926 3.475-7.596c1.044-4.008 1.044-8.23 0-12.238 c-1.048-4.022-3.146-7.827-6.297-10.979C56.572 22.362 50.381 20 44.19 20C38 20 31.809 22.362 27.085 27.085 c-9.447 9.447-9.447 24.763 0 34.21C31.809 66.019 38 68.381 44.19 68.381c4.798 0 9.593-1.425 13.708-4.262l9.695 9.695 l4.899 4.899C73.351 79.571 74.476 80 75.602 80s2.251-0.429 3.11-1.288C80.429 76.994 80.429 74.209 78.712 72.492z M56.942 56.942 c-3.406 3.406-7.934 5.282-12.751 5.282s-9.345-1.876-12.751-5.282c-3.406-3.406-5.282-7.934-5.282-12.751 c0-4.817 1.876-9.345 5.282-12.751c3.406-3.406 7.934-5.282 12.751-5.282c4.817 0 9.345 1.876 12.751 5.282 c3.406 3.406 5.282 7.934 5.282 12.751C62.223 49.007 60.347 53.536 56.942 56.942z"></path>
    </g>
    </g>
    </g>
    </g>
    </svg><h2>loading...<h2>`
    me = await fetch(`http://${IP_ADDRESS}:3000/courseville/me`, options).then(res => res.json()).catch(err => console.log(err));
    document.getElementById("profile-header").innerHTML = `<img class="circular-image" src=${me.account.profile_pict}><div id="profile_name">${me.student.firstname_en} ${me.student.lastname_en}</div>`
    changeColor(document.getElementById("Today"))
    changeTodayPage()
    getUserTags()
    const userTask = await fetch(`http://${IP_ADDRESS}:3000/task/getTasksByStatus/incompleted`, options).then(res => res.json()).catch(err => console.log(error));
    const mcvTask = await fetch(`http://${IP_ADDRESS}:3000/courseville/allAssignments/2/2022`, options).then(res => res.json()).catch(err => console.log(err));
    const completedTasks = await fetch(`http://${IP_ADDRESS}:3000/task/getTasksByStatus/completed`, options).then(res => res.json()).catch(err => console.log(err));
    const allTasks = userTask.concat(mcvTask);
    let allbtntext = document.getElementById("All_Tasks_cnt")
    let combtntext = document.getElementById("Completed_cnt")
    let mcvbtntext = document.getElementById("Mycourseville_cnt")
    setupButton(allbtntext, allTasks.length)
    setupButton(mcvbtntext, mcvTask.length)
    setupButton(combtntext, completedTasks.length)
    resetCheckbox()

    let filters = [...document.getElementsByClassName("filter_checkbox")]
    filters.forEach(filter => {
      filter.addEventListener("click", async function () {
        filters.forEach(filter => {
          if (filter.checked) {
            activeFilters.push(filter.value)
          }
          else {
            activeFilters = activeFilters.filter(val => val != filter.value)
          }
        })
        const allcurrenttasks = [...document.getElementsByClassName("taskitem")]
        allcurrenttasks.forEach(task => {
          if (activeFilters.every(val => task.tags.includes(val))) {
            task.style.display = ""
          } else {
            task.style.display = "none"
          }
        })
      })
    })
  } else {
    document.body.innerHTML = `<h2><div id="loginbox">
    <p id="logintitle">DoToo</p>
    <p id="loginsubtitle">Welcome Back!</p>
    <div id="loginbutton" onClick = "login()">
        <img src="image/mcvlogo.png" style="width: 2vw;height: 2vw;">
        <p style="font-size:1vw">Authenticate with myCourseVille</p>
        <img src="image/loginicon.png" style="width: 1vw;height: 1vw;">
    </div>
</div><h2>`
  }
}

async function login() {
  window.location.href = `http://${IP_ADDRESS}:3000/courseville/auth_app`;
}


async function setupButton(btntext, num) {
  if (num === undefined) {
    num = 0
  }
  btntext.innerText = num
}



async function resetCheckbox() {
  let filters = [...document.getElementsByClassName("filter_checkbox")]
  filters.forEach(filter => {
    filter.checked = false
  })
}





async function getMyCourseVilleTask() {
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  const mcvTask = await fetch(`http://${IP_ADDRESS}:3000/courseville/allAssignments/2/2022`, options).then(res => res.json()).catch(err => console.log(err));
  const sortedmcvTask = mcvTask.sort((a, b) => {
    return a.duetime - b.duetime
  })

  return sortedmcvTask;
}




async function changeMCVPage() {
  resetCheckbox()
  setDisabled(true);
  document.getElementsByClassName("foraddtask")[0].style.height = "100%";
  document.getElementsByClassName("foraddtask")[0].innerHTML = `<div style="width:100%;height:100%;display:flex;justify-content:center;align-item:center;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;display:block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
    <circle cx="50" cy="50" r="39.891" stroke="#6994b7" stroke-width="14.4" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="39.891" stroke="#eeeeee" stroke-width="7.2" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="32.771" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;45.299378454348094 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="47.171" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;66.03388996804073 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
  </g>
  
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1"></animateTransform>
    <path fill="#6994b7" stroke="#000000" d="M97.2,50.1c0,6.1-1.2,12.2-3.5,17.9l-13.3-5.4c1.6-3.9,2.4-8.2,2.4-12.4"></path>
    <path fill="#eeeeee" d="M93.5,49.9c0,1.2,0,2.7-0.1,3.9l-0.4,3.6c-0.4,2-2.3,3.3-4.1,2.8l-0.2-0.1c-1.8-0.5-3.1-2.3-2.7-3.9l0.4-3 c0.1-1,0.1-2.3,0.1-3.3"></path>
    <path fill="#6994b7" stroke="#000000" d="M85.4,62.7c-0.2,0.7-0.5,1.4-0.8,2.1c-0.3,0.7-0.6,1.4-0.9,2c-0.6,1.1-2,1.4-3.2,0.8c-1.1-0.7-1.7-2-1.2-2.9 c0.3-0.6,0.5-1.2,0.8-1.8c0.2-0.6,0.6-1.2,0.7-1.8"></path>
    <path fill="#6994b7" stroke="#000000" d="M94.5,65.8c-0.3,0.9-0.7,1.7-1,2.6c-0.4,0.9-0.7,1.7-1.1,2.5c-0.7,1.4-2.3,1.9-3.4,1.3h0 c-1.1-0.7-1.5-2.2-0.9-3.4c0.4-0.8,0.7-1.5,1-2.3c0.3-0.8,0.7-1.5,0.9-2.3"></path>
  </g>
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
    <path fill="#eeeeee" stroke="#000000" d="M86.9,35.3l-6,2.4c-0.4-1.2-1.1-2.4-1.7-3.5c-0.2-0.5,0.3-1.1,0.9-1C82.3,33.8,84.8,34.4,86.9,35.3z"></path>
    <path fill="#eeeeee" stroke="#000000" d="M87.1,35.3l6-2.4c-0.6-1.7-1.5-3.3-2.3-4.9c-0.3-0.7-1.2-0.6-1.4,0.1C88.8,30.6,88.2,33,87.1,35.3z"></path>
    <path fill="#6994b7" stroke="#000000" d="M82.8,50.1c0-3.4-0.5-6.8-1.6-10c-0.2-0.8-0.4-1.5-0.3-2.3c0.1-0.8,0.4-1.6,0.7-2.4c0.7-1.5,1.9-3.1,3.7-4l0,0 c1.8-0.9,3.7-1.1,5.6-0.3c0.9,0.4,1.7,1,2.4,1.8c0.7,0.8,1.3,1.7,1.7,2.8c1.5,4.6,2.2,9.5,2.3,14.4"></path>
    <path fill="#eeeeee" d="M86.3,50.2l0-0.9l-0.1-0.9l-0.1-1.9c0-0.9,0.2-1.7,0.7-2.3c0.5-0.7,1.3-1.2,2.3-1.4l0.3,0 c0.9-0.2,1.9,0,2.6,0.6c0.7,0.5,1.3,1.4,1.4,2.4l0.2,2.2l0.1,1.1l0,1.1"></path>
    <path fill="#ff9922" d="M93.2,34.6c0.1,0.4-0.3,0.8-0.9,1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1 C92.4,34.2,93,34.3,93.2,34.6z"></path>
    <path fill="#ff9922" d="M81.9,38.7c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.2,38,81.8,38.4,81.9,38.7z"></path>
    <path fill="#000000" d="M88.5,36.8c0.1,0.3-0.2,0.7-0.6,0.8c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.8C87.9,36.3,88.4,36.4,88.5,36.8z"></path>
    <path stroke="#000000" d="M85.9,38.9c0.2,0.6,0.8,0.9,1.4,0.7c0.6-0.2,0.9-0.9,0.6-2.1c0.3,1.2,1,1.7,1.6,1.5c0.6-0.2,0.9-0.8,0.8-1.4"></path>
    <path fill="#6994b7" stroke="#000000" d="M86.8,42.3l0.4,2.2c0.1,0.4,0.1,0.7,0.2,1.1l0.1,1.1c0.1,1.2-0.9,2.3-2.2,2.3c-1.3,0-2.5-0.8-2.5-1.9l-0.1-1 c0-0.3-0.1-0.6-0.2-1l-0.3-1.9"></path>
    <path fill="#6994b7" stroke="#000000" d="M96.2,40.3l0.5,2.7c0.1,0.5,0.2,0.9,0.2,1.4l0.1,1.4c0.1,1.5-0.9,2.8-2.2,2.9h0c-1.3,0-2.5-1.1-2.6-2.4 L92.1,45c0-0.4-0.1-0.8-0.2-1.2l-0.4-2.5"></path>
    <path fill="#000000" d="M91.1,34.1c0.3,0.7,0,1.4-0.7,1.6c-0.6,0.2-1.3-0.1-1.6-0.7c-0.2-0.6,0-1.4,0.7-1.6C90.1,33.1,90.8,33.5,91.1,34.1z"></path>
    <path fill="#000000" d="M85.5,36.3c0.2,0.6-0.1,1.2-0.7,1.5c-0.6,0.2-1.3,0-1.5-0.6C83,36.7,83.4,36,84,35.8C84.6,35.5,85.3,35.7,85.5,36.3z"></path>
  
  </g>
  </svg></div>`
  let mcvTask = await getMyCourseVilleTask();
  console.log(mcvTask);
  if (mcvTask.length !== 0) {
    renderTasklist(mcvTask);
  } else {
    document.getElementsByClassName("foraddtask")[0].innerHTML = `<h2>There is no task on this day</h2>`
  }
  setDisabled(false);
}









async function getTodayTask() {
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  const todaytasks = await fetch(`http://${IP_ADDRESS}:3000/task/getTasksByDueDate/${new Date()}`, options).then(res => res.json()).catch(err => console.log(err));
  return todaytasks;
}

async function getAllTagList() {
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  const list = await fetch(`http://${IP_ADDRESS}:3000/tag/getTags`, options).then(res => res.json()).then(data => data.map(tag => tag.tag_name)).then(a => a).catch(err => console.log(err));
  return list;
}
async function changeTodayPage() {
  setDisabled(true);
  addDateBox()
  getAllTagList()
  resetCheckbox()
  document.getElementsByClassName("foraddtask")[0].style.height = "100%";
  document.getElementsByClassName("foraddtask")[0].innerHTML = `<div style="width:100%;height:100%;display:flex;justify-content:center;align-item:center;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="187px" height="187px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1235294117647059s"></animateTransform>
    <circle cx="50" cy="50" r="39.891" stroke="#b4eaed" stroke-width="14.4" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;57.89842791548991 300;15 300" keyTimes="0;0.5;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.05682352941176471s"></animate>
    </circle>
    <circle cx="50" cy="50" r="39.891" stroke="#f5fcff" stroke-width="7.2" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;57.89842791548991 300;15 300" keyTimes="0;0.5;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.05682352941176471s"></animate>
    </circle>
    <circle cx="50" cy="50" r="32.771" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;47.5643473770655 300;15 300" keyTimes="0;0.5;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.05682352941176471s"></animate>
    </circle>
    <circle cx="50" cy="50" r="47.171" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;69.33558446644277 300;15 300" keyTimes="0;0.5;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.05682352941176471s"></animate>
    </circle>
  </g>
  
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1"></animateTransform>
    <path fill="#b4eaed" stroke="#000000" d="M97.2,50.1c0,6.1-1.2,12.2-3.5,17.9l-13.3-5.4c1.6-3.9,2.4-8.2,2.4-12.4"></path>
    <path fill="#f5fcff" d="M93.5,49.9c0,1.2,0,2.7-0.1,3.9l-0.4,3.6c-0.4,2-2.3,3.3-4.1,2.8l-0.2-0.1c-1.8-0.5-3.1-2.3-2.7-3.9l0.4-3 c0.1-1,0.1-2.3,0.1-3.3"></path>
    <path fill="#b4eaed" stroke="#000000" d="M85.4,62.7c-0.2,0.7-0.5,1.4-0.8,2.1c-0.3,0.7-0.6,1.4-0.9,2c-0.6,1.1-2,1.4-3.2,0.8c-1.1-0.7-1.7-2-1.2-2.9 c0.3-0.6,0.5-1.2,0.8-1.8c0.2-0.6,0.6-1.2,0.7-1.8"></path>
    <path fill="#b4eaed" stroke="#000000" d="M94.5,65.8c-0.3,0.9-0.7,1.7-1,2.6c-0.4,0.9-0.7,1.7-1.1,2.5c-0.7,1.4-2.3,1.9-3.4,1.3h0 c-1.1-0.7-1.5-2.2-0.9-3.4c0.4-0.8,0.7-1.5,1-2.3c0.3-0.8,0.7-1.5,0.9-2.3"></path>
  </g>
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1235294117647059s"></animateTransform>
    <path fill="#f5fcff" stroke="#000000" d="M86.9,35.3l-6,2.4c-0.4-1.2-1.1-2.4-1.7-3.5c-0.2-0.5,0.3-1.1,0.9-1C82.3,33.8,84.8,34.4,86.9,35.3z"></path>
    <path fill="#f5fcff" stroke="#000000" d="M87.1,35.3l6-2.4c-0.6-1.7-1.5-3.3-2.3-4.9c-0.3-0.7-1.2-0.6-1.4,0.1C88.8,30.6,88.2,33,87.1,35.3z"></path>
    <path fill="#b4eaed" stroke="#000000" d="M82.8,50.1c0-3.4-0.5-6.8-1.6-10c-0.2-0.8-0.4-1.5-0.3-2.3c0.1-0.8,0.4-1.6,0.7-2.4c0.7-1.5,1.9-3.1,3.7-4l0,0 c1.8-0.9,3.7-1.1,5.6-0.3c0.9,0.4,1.7,1,2.4,1.8c0.7,0.8,1.3,1.7,1.7,2.8c1.5,4.6,2.2,9.5,2.3,14.4"></path>
    <path fill="#f5fcff" d="M86.3,50.2l0-0.9l-0.1-0.9l-0.1-1.9c0-0.9,0.2-1.7,0.7-2.3c0.5-0.7,1.3-1.2,2.3-1.4l0.3,0 c0.9-0.2,1.9,0,2.6,0.6c0.7,0.5,1.3,1.4,1.4,2.4l0.2,2.2l0.1,1.1l0,1.1"></path>
    <path fill="#3b4368" d="M93.2,34.6c0.1,0.4-0.3,0.8-0.9,1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1 C92.4,34.2,93,34.3,93.2,34.6z"></path>
    <path fill="#3b4368" d="M81.9,38.7c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.2,38,81.8,38.4,81.9,38.7z"></path>
    <path fill="#000000" d="M88.5,36.8c0.1,0.3-0.2,0.7-0.6,0.8c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.8C87.9,36.3,88.4,36.4,88.5,36.8z"></path>
    <path stroke="#000000" d="M85.9,38.9c0.2,0.6,0.8,0.9,1.4,0.7c0.6-0.2,0.9-0.9,0.6-2.1c0.3,1.2,1,1.7,1.6,1.5c0.6-0.2,0.9-0.8,0.8-1.4"></path>
    <path fill="#b4eaed" stroke="#000000" d="M86.8,42.3l0.4,2.2c0.1,0.4,0.1,0.7,0.2,1.1l0.1,1.1c0.1,1.2-0.9,2.3-2.2,2.3c-1.3,0-2.5-0.8-2.5-1.9l-0.1-1 c0-0.3-0.1-0.6-0.2-1l-0.3-1.9"></path>
    <path fill="#b4eaed" stroke="#000000" d="M96.2,40.3l0.5,2.7c0.1,0.5,0.2,0.9,0.2,1.4l0.1,1.4c0.1,1.5-0.9,2.8-2.2,2.9h0c-1.3,0-2.5-1.1-2.6-2.4 L92.1,45c0-0.4-0.1-0.8-0.2-1.2l-0.4-2.5"></path>
    <path fill="#000000" d="M91.1,34.1c0.3,0.7,0,1.4-0.7,1.6c-0.6,0.2-1.3-0.1-1.6-0.7c-0.2-0.6,0-1.4,0.7-1.6C90.1,33.1,90.8,33.5,91.1,34.1z"></path>
    <path fill="#000000" d="M85.5,36.3c0.2,0.6-0.1,1.2-0.7,1.5c-0.6,0.2-1.3,0-1.5-0.6C83,36.7,83.4,36,84,35.8C84.6,35.5,85.3,35.7,85.5,36.3z"></path>
  
  </g>
  </svg></div>`
  console.log("changeTodayPage")
  let todaytasks = await getTodayTask();
  let todaybtntext = document.getElementById("Today_cnt")
  setupButton(todaybtntext, todaytasks.length)
  if (todaytasks.length !== 0) {
    renderTasklist(todaytasks);
  } else {
    document.getElementsByClassName("foraddtask")[0].innerHTML = `<h2>There is no task today</h2>`
  }
  setDisabled(false);
}








async function getDayTask(date) {
  console.log(date)
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  const dayTasks = await fetch(`http://${IP_ADDRESS}:3000/task/getTasksByDueDate/${date}`, options).then(res => res.json()).catch(err => console.log(err));
  return dayTasks;
}

function resetSidebar() {
  const sidebarButtonColor = hexToRgb("#F1FAFE");
  const sidebarButtons = [...document.getElementsByClassName("myButton")];
  sidebarButtons.forEach(b => {
    b.classList.remove("clicked");
    b.style.backgroundColor = sidebarButtonColor;
  })
}

async function changeDayPage(date) {
  setDisabled(true);
  resetCheckbox()
  resetSidebar()
  document.getElementsByClassName("foraddtask")[0].style.height = "100%";
  document.getElementsByClassName("foraddtask")[0].innerHTML = `<div style="width:100%;height:100%;display:flex;justify-content:center;align-item:center;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;display:block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
    <circle cx="50" cy="50" r="39.891" stroke="#6994b7" stroke-width="14.4" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="39.891" stroke="#eeeeee" stroke-width="7.2" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="32.771" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;45.299378454348094 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="47.171" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;66.03388996804073 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
  </g>
  
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1"></animateTransform>
    <path fill="#6994b7" stroke="#000000" d="M97.2,50.1c0,6.1-1.2,12.2-3.5,17.9l-13.3-5.4c1.6-3.9,2.4-8.2,2.4-12.4"></path>
    <path fill="#eeeeee" d="M93.5,49.9c0,1.2,0,2.7-0.1,3.9l-0.4,3.6c-0.4,2-2.3,3.3-4.1,2.8l-0.2-0.1c-1.8-0.5-3.1-2.3-2.7-3.9l0.4-3 c0.1-1,0.1-2.3,0.1-3.3"></path>
    <path fill="#6994b7" stroke="#000000" d="M85.4,62.7c-0.2,0.7-0.5,1.4-0.8,2.1c-0.3,0.7-0.6,1.4-0.9,2c-0.6,1.1-2,1.4-3.2,0.8c-1.1-0.7-1.7-2-1.2-2.9 c0.3-0.6,0.5-1.2,0.8-1.8c0.2-0.6,0.6-1.2,0.7-1.8"></path>
    <path fill="#6994b7" stroke="#000000" d="M94.5,65.8c-0.3,0.9-0.7,1.7-1,2.6c-0.4,0.9-0.7,1.7-1.1,2.5c-0.7,1.4-2.3,1.9-3.4,1.3h0 c-1.1-0.7-1.5-2.2-0.9-3.4c0.4-0.8,0.7-1.5,1-2.3c0.3-0.8,0.7-1.5,0.9-2.3"></path>
  </g>
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
    <path fill="#eeeeee" stroke="#000000" d="M86.9,35.3l-6,2.4c-0.4-1.2-1.1-2.4-1.7-3.5c-0.2-0.5,0.3-1.1,0.9-1C82.3,33.8,84.8,34.4,86.9,35.3z"></path>
    <path fill="#eeeeee" stroke="#000000" d="M87.1,35.3l6-2.4c-0.6-1.7-1.5-3.3-2.3-4.9c-0.3-0.7-1.2-0.6-1.4,0.1C88.8,30.6,88.2,33,87.1,35.3z"></path>
    <path fill="#6994b7" stroke="#000000" d="M82.8,50.1c0-3.4-0.5-6.8-1.6-10c-0.2-0.8-0.4-1.5-0.3-2.3c0.1-0.8,0.4-1.6,0.7-2.4c0.7-1.5,1.9-3.1,3.7-4l0,0 c1.8-0.9,3.7-1.1,5.6-0.3c0.9,0.4,1.7,1,2.4,1.8c0.7,0.8,1.3,1.7,1.7,2.8c1.5,4.6,2.2,9.5,2.3,14.4"></path>
    <path fill="#eeeeee" d="M86.3,50.2l0-0.9l-0.1-0.9l-0.1-1.9c0-0.9,0.2-1.7,0.7-2.3c0.5-0.7,1.3-1.2,2.3-1.4l0.3,0 c0.9-0.2,1.9,0,2.6,0.6c0.7,0.5,1.3,1.4,1.4,2.4l0.2,2.2l0.1,1.1l0,1.1"></path>
    <path fill="#ff9922" d="M93.2,34.6c0.1,0.4-0.3,0.8-0.9,1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1 C92.4,34.2,93,34.3,93.2,34.6z"></path>
    <path fill="#ff9922" d="M81.9,38.7c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.2,38,81.8,38.4,81.9,38.7z"></path>
    <path fill="#000000" d="M88.5,36.8c0.1,0.3-0.2,0.7-0.6,0.8c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.8C87.9,36.3,88.4,36.4,88.5,36.8z"></path>
    <path stroke="#000000" d="M85.9,38.9c0.2,0.6,0.8,0.9,1.4,0.7c0.6-0.2,0.9-0.9,0.6-2.1c0.3,1.2,1,1.7,1.6,1.5c0.6-0.2,0.9-0.8,0.8-1.4"></path>
    <path fill="#6994b7" stroke="#000000" d="M86.8,42.3l0.4,2.2c0.1,0.4,0.1,0.7,0.2,1.1l0.1,1.1c0.1,1.2-0.9,2.3-2.2,2.3c-1.3,0-2.5-0.8-2.5-1.9l-0.1-1 c0-0.3-0.1-0.6-0.2-1l-0.3-1.9"></path>
    <path fill="#6994b7" stroke="#000000" d="M96.2,40.3l0.5,2.7c0.1,0.5,0.2,0.9,0.2,1.4l0.1,1.4c0.1,1.5-0.9,2.8-2.2,2.9h0c-1.3,0-2.5-1.1-2.6-2.4 L92.1,45c0-0.4-0.1-0.8-0.2-1.2l-0.4-2.5"></path>
    <path fill="#000000" d="M91.1,34.1c0.3,0.7,0,1.4-0.7,1.6c-0.6,0.2-1.3-0.1-1.6-0.7c-0.2-0.6,0-1.4,0.7-1.6C90.1,33.1,90.8,33.5,91.1,34.1z"></path>
    <path fill="#000000" d="M85.5,36.3c0.2,0.6-0.1,1.2-0.7,1.5c-0.6,0.2-1.3,0-1.5-0.6C83,36.7,83.4,36,84,35.8C84.6,35.5,85.3,35.7,85.5,36.3z"></path>
  
  </g>
  </svg></div>`
  let dayTasks = await getDayTask(date);

  if (dayTasks.length !== 0) {
    renderTasklist(dayTasks);
  } else {
    document.getElementsByClassName("foraddtask")[0].innerHTML = `<h2>There is no task on this day</h2>`
  }
  setDisabled(false);
}

async function getCompletedTasks() {
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  const completeTasks = await fetch(`http://${IP_ADDRESS}:3000/task/getTasksByStatus/completed`, options).then(res => res.json()).catch(err => console.log(err));
  return completeTasks;
}

async function changeCompletedPage() {
  setDisabled(true);
  resetCheckbox()
  document.getElementsByClassName("foraddtask")[0].style.height = "100%";
  document.getElementsByClassName("foraddtask")[0].innerHTML = `<div style="width:100%;height:100%;display:flex;justify-content:center;align-item:center;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="194px" height="194px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="0.8474576271186441s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.08474576271186442s"></animateTransform>
    <circle cx="50" cy="50" r="39.891" stroke="#fefefe" stroke-width="14.4" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="0.8474576271186441s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.03898305084745763s"></animate>
    </circle>
    <circle cx="50" cy="50" r="39.891" stroke="#f19a33" stroke-width="7.2" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="0.8474576271186441s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.03898305084745763s"></animate>
    </circle>
    <circle cx="50" cy="50" r="32.771" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;45.299378454348094 300;15 300" keyTimes="0;0.5;1" dur="0.8474576271186441s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.03898305084745763s"></animate>
    </circle>
    <circle cx="50" cy="50" r="47.171" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;66.03388996804073 300;15 300" keyTimes="0;0.5;1" dur="0.8474576271186441s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.03898305084745763s"></animate>
    </circle>
  </g>
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="0.8474576271186441s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1"></animateTransform>
  
    <path fill="#fefefe" stroke="#000000" d="M97.2,50c0,6.1-1.2,12.2-3.5,17.8l-13.3-5.4c1.6-3.9,2.4-8.2,2.4-12.4"></path>
    <path fill="#f19a33" transform="translate(0,-0.1)" d="M93.6,50c0,1.2,0,2.4-0.1,3.6L93,57.2c-0.4,2-2.3,3.3-4.2,2.8l-0.2-0.1c-1.8-0.5-3.1-2.3-2.7-3.9l0.4-3 c0.1-1,0.1-2,0.1-3"></path>
    <path fill="#fefefe" stroke="#000000" d="M85.4,62.5c-0.2,0.7-0.5,1.4-0.8,2.1c-0.3,0.7-0.6,1.4-0.9,2c-0.6,1.1-2,1.4-3.2,0.8v0c-1.1-0.7-1.7-2-1.2-2.9 c0.3-0.6,0.5-1.2,0.8-1.8c0.2-0.6,0.6-1.2,0.7-1.8"></path>
    <path fill="#fefefe" stroke="#000000" d="M94.5,65.7c-0.3,0.9-0.7,1.7-1,2.6c-0.4,0.8-0.7,1.7-1.1,2.5c-0.7,1.4-2.3,1.9-3.4,1.3l0,0 c-1.1-0.7-1.5-2.2-0.9-3.4c0.4-0.8,0.7-1.5,1-2.3c0.3-0.8,0.7-1.5,0.9-2.3"></path>
    <path fill="#fefefe" stroke="#000000" d="M85.6,67c0,0.8,0.1,1.6,0.3,2.4c0.6-0.5,1.1-1,1.4-1.7c0.2-0.7,0.2-1.5-0.1-2.2C86.5,64,85.6,66.3,85.6,67z"></path>
  
  </g>
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="0.8474576271186441s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.08474576271186442s"></animateTransform>
  
    <path fill="#f19a33" stroke="#000000" d="M91,33.6l-10,4c-0.4-1.2-1.1-2.4-1.7-3.5c-0.2-0.5,0.3-1.1,0.9-1C83.6,32.9,87.4,32.9,91,33.6z"></path>
    <path fill="#f19a33" stroke="#000000" d="M83.2,36.7l10-4c-0.6-1.7-1.5-3.3-2.3-4.9c-0.3-0.7-1.2-0.6-1.4,0.1C87.6,31.1,85.7,34,83.2,36.7z"></path>
    <path fill="#fefefe" stroke="#000000" transform="translate(0,0.2)" d="M82.8,50c0-3.4-0.5-6.8-1.5-10c-0.2-0.8-0.4-1.5-0.3-2.3c0.1-0.8,0.4-1.6,0.7-2.4c0.7-1.5,1.9-3.1,3.7-4l0,0 c1.8-0.9,3.7-1,5.6-0.3c0.9,0.4,1.7,1,2.4,1.8c0.7,0.8,1.3,1.7,1.7,2.8c1.5,4.6,2.2,9.5,2.2,14.4"></path>
    <path fill="#f19a33" transform="translate(0,0.3)" d="M86.4,50l0-0.9l-0.1-0.9l-0.1-1.9c0-0.9,0.2-1.7,0.7-2.3c0.5-0.7,1.3-1.2,2.3-1.4l0.3,0c0.9-0.2,1.9,0,2.6,0.6 c0.7,0.5,1.3,1.4,1.4,2.4l0.2,2.2l0.1,1.1l0,1.1"></path>
    <path fill="#000000" d="M88.6,36.6c0.1,0.3-0.2,0.7-0.6,0.8c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.8C88,36.1,88.5,36.2,88.6,36.6z"></path>
    <path fill="none" stroke="#000000" d="M86,38.7c0.2,0.6,0.8,0.9,1.4,0.7c0.6-0.2,0.9-0.9,0.6-2.1c0.3,1.2,1,1.7,1.6,1.5c0.6-0.2,0.9-0.8,0.8-1.4"></path>
    <path fill="#fefefe" stroke="#000000" d="M86.8,42.2l0.4,2.2c0.1,0.4,0.1,0.7,0.2,1.1l0.1,1.1c0.1,1.2-0.9,2.3-2.2,2.3h0c-1.3,0-2.5-0.8-2.5-1.9l-0.1-1 c0-0.3-0.1-0.6-0.2-1l-0.3-1.9"></path>
    <path fill="#fefefe" stroke="#000000" d="M96.2,40.2l0.5,2.7c0.1,0.5,0.2,0.9,0.2,1.4l0.1,1.4c0.1,1.5-0.9,2.8-2.2,2.8c-1.3,0-2.5-1.1-2.6-2.4l-0.1-1.2 c0-0.4-0.1-0.8-0.2-1.2l-0.4-2.5"></path>
    <path fill="none" stroke="#000000" d="M90.9,36.4c1.1-1.1,2.7-1.6,4.3-1.9"></path>
    <path fill="none" stroke="#000000" d="M91.6,37.5c1.3-0.5,2.8-0.8,4.2-0.7"></path>
    <path fill="none" stroke="#000000" d="M91.7,38.8c0.2-0.1,0.4-0.1,0.7-0.1c1.2-0.1,2.5,0,3.8,0.3"></path>
    <path fill="none" stroke="#000000" d="M85,38.4c-1.6-0.1-3.1,0.6-4.6,1.2"></path>
    <path fill="none" stroke="#000000" d="M85,39.5c-1.4,0.3-2.8,0.9-4,1.6"></path>
    <path fill="none" stroke="#000000" d="M85.5,40.4c-0.2,0-0.4,0.1-0.7,0.2c-1.1,0.5-2.2,1.1-3.2,1.8"></path>
    <path fill="#000000" d="M92.8,34.2c0.1,0.3-0.3,0.8-0.9,1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1 C92.1,33.8,92.7,33.9,92.8,34.2z"></path>
    <path fill="#000000" d="M82.2,38.2c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.5,37.5,82,37.9,82.2,38.2z"></path>
    <path fill="#000000" d="M90,35.7L89.3,36l-0.3-0.7c-0.3-0.9,0.1-1.9,0.9-2.3l0.7-0.3l0.3,0.7C91.3,34.4,90.9,35.4,90,35.7z"></path>
    <path fill="#000000" d="M85.3,37.4l0.7-0.2l-0.2-0.6c-0.3-0.8-1.3-1.2-2.1-0.8L82.9,36l0.2,0.6C83.5,37.4,84.4,37.7,85.3,37.4z"></path>
  
  </g>
  </svg></div>
  `
  let completeTasks = await getCompletedTasks();
  if (completeTasks.length !== 0) {
    renderTasklist(completeTasks);
  } else {
    document.getElementsByClassName("foraddtask")[0].innerHTML = `<h2>There is no completed task</h2>`
  }
  setDisabled(false);
}


function addDateBox() {
  let formargin = document.getElementById("foraddDate")
  let checkboxdate = new Date();
  let day = checkboxdate.getDate();
  let month = checkboxdate.getMonth();

  const arr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let newweekday = arr[checkboxdate.getDay()];

  const numberToMonth = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
  };

  formargin.innerHTML = `
  <div class="outside">
  <div class="loader">
    <div class="sq1" id="fsq1">
      <span id="month" class="month">${numberToMonth[month + 1]}</span>

    </div>
    <div class="sq2" id="fsq2">

      <div class="right">
        <span class="weekday" id="weekday">${newweekday}</span>
        <span class="daynumber" id="daynumber">${day}</span>
      </div>
    </div>


    <div class="loader2">
      <div class="sq1" id="ffsq1">
        <span id="monthchange" class="month">${numberToMonth[month + 1]}</span>
      </div>
      <!-- <div class="line"></div> -->
      <div class="sq2" id="ffsq2">
        <div class="right">
          <span class="weekday " id="weekdaychange">${newweekday}</span>
          <span class="daynumber " id="daynumberchange">${day}</span>
        </div>
      </div>
    </div>
  </div>
</div>`
  const colorlast = document.getElementById("fsq2")
  const colorone = document.getElementById("ffsq2")
  colorlast.style.backgroundColor = color[newweekday];
  colorone.style.backgroundColor = color[newweekday]

}



async function changeAllTaskPage() {
  setDisabled(true);
  resetCheckbox()
  document.getElementsByClassName("foraddtask")[0].style.height = "100%";
  document.getElementsByClassName("foraddtask")[0].innerHTML = `<div style="width:100%;height:100%;display:flex;justify-content:center;align-item:center;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="211px" height="211px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
    <circle cx="50" cy="50" r="39.891" stroke="#e0dcb8" stroke-width="14.4" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="39.891" stroke="#aca730" stroke-width="7.2" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;55.1413599195142 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="32.771" stroke="#985d4e" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;45.299378454348094 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
    <circle cx="50" cy="50" r="47.171" stroke="#985d4e" stroke-width="1" fill="none" stroke-dasharray="0 300">
      <animate attributeName="stroke-dasharray" values="15 300;66.03388996804073 300;15 300" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.046s"></animate>
    </circle>
  </g>
  
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1"></animateTransform>
    <path fill="#e0dcb8" stroke="#985d4e" d="M97.2,50.1c0,6.1-1.2,12.2-3.5,17.9l-13.3-5.4c1.6-3.9,2.4-8.2,2.4-12.4"></path>
    <path fill="#aca730" d="M93.5,49.9c0,1.2,0,2.7-0.1,3.9l-0.4,3.6c-0.4,2-2.3,3.3-4.1,2.8l-0.2-0.1c-1.8-0.5-3.1-2.3-2.7-3.9l0.4-3 c0.1-1,0.1-2.3,0.1-3.3"></path>
    <path fill="#e0dcb8" stroke="#985d4e" d="M85.4,62.7c-0.2,0.7-0.5,1.4-0.8,2.1c-0.3,0.7-0.6,1.4-0.9,2c-0.6,1.1-2,1.4-3.2,0.8c-1.1-0.7-1.7-2-1.2-2.9 c0.3-0.6,0.5-1.2,0.8-1.8c0.2-0.6,0.6-1.2,0.7-1.8"></path>
    <path fill="#e0dcb8" stroke="#985d4e" d="M94.5,65.8c-0.3,0.9-0.7,1.7-1,2.6c-0.4,0.9-0.7,1.7-1.1,2.5c-0.7,1.4-2.3,1.9-3.4,1.3h0 c-1.1-0.7-1.5-2.2-0.9-3.4c0.4-0.8,0.7-1.5,1-2.3c0.3-0.8,0.7-1.5,0.9-2.3"></path>
  </g>
  <g>
    <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1s"></animateTransform>
    <path fill="#aca730" stroke="#985d4e" d="M86.9,35.3l-6,2.4c-0.4-1.2-1.1-2.4-1.7-3.5c-0.2-0.5,0.3-1.1,0.9-1C82.3,33.8,84.8,34.4,86.9,35.3z"></path>
    <path fill="#aca730" stroke="#985d4e" d="M87.1,35.3l6-2.4c-0.6-1.7-1.5-3.3-2.3-4.9c-0.3-0.7-1.2-0.6-1.4,0.1C88.8,30.6,88.2,33,87.1,35.3z"></path>
    <path fill="#e0dcb8" stroke="#985d4e" d="M82.8,50.1c0-3.4-0.5-6.8-1.6-10c-0.2-0.8-0.4-1.5-0.3-2.3c0.1-0.8,0.4-1.6,0.7-2.4c0.7-1.5,1.9-3.1,3.7-4l0,0 c1.8-0.9,3.7-1.1,5.6-0.3c0.9,0.4,1.7,1,2.4,1.8c0.7,0.8,1.3,1.7,1.7,2.8c1.5,4.6,2.2,9.5,2.3,14.4"></path>
    <path fill="#aca730" d="M86.3,50.2l0-0.9l-0.1-0.9l-0.1-1.9c0-0.9,0.2-1.7,0.7-2.3c0.5-0.7,1.3-1.2,2.3-1.4l0.3,0 c0.9-0.2,1.9,0,2.6,0.6c0.7,0.5,1.3,1.4,1.4,2.4l0.2,2.2l0.1,1.1l0,1.1"></path>
    <path fill="#4f563b" d="M93.2,34.6c0.1,0.4-0.3,0.8-0.9,1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1 C92.4,34.2,93,34.3,93.2,34.6z"></path>
    <path fill="#4f563b" d="M81.9,38.7c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.2,38,81.8,38.4,81.9,38.7z"></path>
    <path fill="#985d4e" d="M88.5,36.8c0.1,0.3-0.2,0.7-0.6,0.8c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.8C87.9,36.3,88.4,36.4,88.5,36.8z"></path>
    <path stroke="#985d4e" d="M85.9,38.9c0.2,0.6,0.8,0.9,1.4,0.7c0.6-0.2,0.9-0.9,0.6-2.1c0.3,1.2,1,1.7,1.6,1.5c0.6-0.2,0.9-0.8,0.8-1.4"></path>
    <path fill="#e0dcb8" stroke="#985d4e" d="M86.8,42.3l0.4,2.2c0.1,0.4,0.1,0.7,0.2,1.1l0.1,1.1c0.1,1.2-0.9,2.3-2.2,2.3c-1.3,0-2.5-0.8-2.5-1.9l-0.1-1 c0-0.3-0.1-0.6-0.2-1l-0.3-1.9"></path>
    <path fill="#e0dcb8" stroke="#985d4e" d="M96.2,40.3l0.5,2.7c0.1,0.5,0.2,0.9,0.2,1.4l0.1,1.4c0.1,1.5-0.9,2.8-2.2,2.9h0c-1.3,0-2.5-1.1-2.6-2.4 L92.1,45c0-0.4-0.1-0.8-0.2-1.2l-0.4-2.5"></path>
    <path fill="#985d4e" d="M91.1,34.1c0.3,0.7,0,1.4-0.7,1.6c-0.6,0.2-1.3-0.1-1.6-0.7c-0.2-0.6,0-1.4,0.7-1.6C90.1,33.1,90.8,33.5,91.1,34.1z"></path>
    <path fill="#985d4e" d="M85.5,36.3c0.2,0.6-0.1,1.2-0.7,1.5c-0.6,0.2-1.3,0-1.5-0.6C83,36.7,83.4,36,84,35.8C84.6,35.5,85.3,35.7,85.5,36.3z"></path>
  
  </g>
  </svg></div>`
  const options = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  }
  const userTask = await fetch(`http://${IP_ADDRESS}:3000/task/getTasksByStatus/incompleted`, options).then(res => res.json()).catch(err => console.log(error));
  const mcvTask = await fetch(`http://${IP_ADDRESS}:3000/courseville/allAssignments/2/2022`, options).then(res => res.json()).catch(err => console.log(err));
  const allTasks = userTask.concat(mcvTask);
  let allbtntext = document.getElementById("All_Tasks_cnt")
  console.log(allTasks)
  renderTasklist(allTasks);
  setupButton(allbtntext, allTasks.length)
  setDisabled(false);
}

async function getUserTags() {
  const options = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  }
  const tags = await fetch(`http://${IP_ADDRESS}:3000/tag/getTags`, options).then(res => res.json()).catch(err => console.log(error));
  tags.forEach(tag => {
    createTag(tag)
  })

}

function createTag(tag) {
  let deleteButton = document.createElement('button')
  let checkbox_container = document.getElementById("checkbox-container");
  let checkbox_content = document.createElement('div')


  let checkbox = document.createElement('input');

  checkbox_content.id = "checkbox-content"
  checkbox.type = "checkbox";
  checkbox.className = "filter_checkbox";
  checkbox.id = tag.tag_id;
  checkbox.name = tag.tag_name;
  checkbox.value = tag.tag_name;

  let label = document.createElement('label')
  label.innerText = tag.tag_name;
  deleteButton.innerText = "X";
  deleteButton.className = "tagDeleteButton";

  deleteButton.onclick = function () {
    deleteTag(tag.tag_id);
    checkbox_container.removeChild(checkbox_content);
  }

  checkbox_content.appendChild(checkbox);
  checkbox_content.appendChild(label);
  checkbox_content.appendChild(deleteButton);
  checkbox_container.appendChild(checkbox_content);
}

function createTaskitem(task) {
  document.getElementsByClassName("foraddtask")[0].style.height = "fit-content";
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
  taskitem.tags = task.tags;
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
  checkbox_input.status = "incomplete"
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

function createCompletedTaskitem(task) {
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

  taskitem.className = "taskitemcomplete";
  taskitem.id = task.task_id;
  taskitemtext.className = "taskitemtext";
  checkandtext.className = "checkandtext";
  checkbox.className = "checkbox";
  checkbox_input.className = "checkbox_input";
  checkbox_box.className = "checkbox_box";

  outdate.className = "outdate";
  outdate_top.className = "outdate_top";
  outdate_bottom.className = "outdate_bottom";
  outdate_bottom.style = "color: #646464";

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
  checkbox_input.status = "complete"
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
  document.getElementsByClassName("foraddtask")[0].style.height = "fit-content";
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
    openDetailmcvtaskOverlay({ course_title: task.course_title, title: task.title, instruction: task.instruction, duetime: task.duetime, icon: task.icon });
  }

  mcvtextspan.innerText = task.title;
  mcvicon.src = task.icon

  if (new Date(task.duetime * 1000).getHours().toString().length == 1) {
    outdate_bottom.innerText = "0" + new Date(task.duetime * 1000).getHours().toString() + ":"
  } else {
    outdate_bottom.innerText = new Date(task.duetime * 1000).getHours().toString() + ":"
  }

  if (new Date(task.time).getMinutes().toString().length == 1) {
    outdate_bottom.innerText += "0" + new Date(task.duetime * 1000).getMinutes().toString()
  } else {
    outdate_bottom.innerText += new Date(task.duetime * 1000).getMinutes().toString()
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
  await fetch(`http://${IP_ADDRESS}:3000/task/deleteTask`, options).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));
  let button = [...document.getElementsByClassName("myButton")].filter(button => button.classList.contains("clicked"))[0];
  console.log(button.id)
  if (button.id === "Today" || button.id === "All_Tasks") {
    document.getElementById("All_Tasks_cnt").innerText = parseInt(document.getElementById("All_Tasks_cnt").innerText) - 1;
  } else if (button.id === "Completed") {
    console.log("delete")
    console.log(document.getElementById("Completed_cnt"))
    document.getElementById("Completed_cnt").innerText = parseInt(document.getElementById("Completed_cnt").innerText) - 1;
  } else {
    changeTodayPage();
  }
  let todaytasks = await getTodayTask();
  let todaybtntext = document.getElementById("Today_cnt")
  setupButton(todaybtntext, todaytasks.length)
}
async function handleCheckboxChange(checkbox) {

  if (checkbox.checked) {
    const task = {
      task_id: checkbox.id,
    }
    if (checkbox.status == "incomplete") {
      document.getElementById("All_Tasks_cnt").innerText = parseInt(document.getElementById("All_Tasks_cnt").innerText) - 1;
      document.getElementById("Completed_cnt").innerText = parseInt(document.getElementById("Completed_cnt").innerText) + 1;
      task.task_status = "completed";
    } else if (checkbox.status == "complete") {
      document.getElementById("Completed_cnt").innerText = parseInt(document.getElementById("Completed_cnt").innerText) - 1;
      document.getElementById("All_Tasks_cnt").innerText = parseInt(document.getElementById("All_Tasks_cnt").innerText) + 1;
      task.task_status = "incompleted"
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
      console.log(task)
      const upDateTask = await fetch(`http://${IP_ADDRESS}:3000/task/updateTask`, options).then(res => res.json()).catch(err => console.log(err));
      const taskList = document.getElementsByClassName("foraddtask")[0];
      const taskitem = document.getElementById(checkbox.id);
      taskList.removeChild(taskitem);
      console.log(upDateTask)
    }
    catch (err) {
      console.log(err);
    }
    let todaytasks = await getTodayTask();
    let todaybtntext = document.getElementById("Today_cnt")
    setupButton(todaybtntext, todaytasks.length)
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

function createTask() {
  let task_name = document.getElementById("createtask_Name").value;
  let task_description = document.getElementById("createtask_Description").value;
  let tags = [];
  document.getElementById("createtask_taglist").querySelectorAll(".createtask_tagbox").forEach(tagbox => {
    if (tagbox.textContent !== "My Task") {
      console.log(tagbox.textContent.substring(0, tagbox.textContent.length - 1));
      tags.push(tagbox.textContent.substring(0, tagbox.textContent.length - 1));
    } else {
      tags.push(tagbox.textContent);
    }
  });
  let calendar = document.getElementById("ctcalendar");
  let month = ctcurr_month.value;
  let year = ctcurr_year.value;
  let day = ctcurrDate.getDate();
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
    task_status: "incompleted"
  }
  addTask(task);

  closeCreatetask();
  closeScreenOverlay();
  document.getElementById("All_Tasks_cnt").innerText = parseInt(document.getElementById("All_Tasks_cnt").innerText) + 1;
  changeColor(document.getElementById("Today"))
  changeTodayPage();
}

function renderTasklist(tasks) {
  document.getElementsByClassName("foraddtask")[0].style.height = "fit-content";
  let taskList = document.getElementsByClassName("foraddtask")[0];
  taskList.innerHTML = "";
  tasks.forEach(task => {
    if (task.tags === undefined) {
      // mcv task
      createMCVTaskitem(task);
    }
    else {
      // my task
      if (task.task_status === "incompleted") {
        createTaskitem(task);
      } else {
        createCompletedTaskitem(task);
      }
    }
  });

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







let ctcurrDate = new Date()
let ctcurr_month = { value: ctcurrDate.getMonth() }
let ctcurr_year = { value: ctcurrDate.getFullYear() }
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
  calendar.className = 'ctcalendar';
  calendar.id = "ctcalendar";

  let calendar_header = document.createElement('div');
  calendar_header.className = "ctcalendar-header";
  let insideheader = '<span class="ctmonth-picker" id="month-picker">April</span><div class="ctyear-picker"><span class="ctyear-change" id="ctprev-year"><</span><span id="year">2022</span><span class="ctyear-change" id="ctnext-year">></span></div>';
  calendar_header.innerHTML = insideheader;

  let calendar_body = document.createElement('div');
  let insidebody = '<div class="ctcalendar-week-day"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div></div><div class="ctcalendar-days"></div>';
  calendar_body.innerHTML = insidebody;

  let month_list = document.createElement('div');
  month_list.className = "ctmonth-list";
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

  let month_picker = calendar.querySelector('#month-picker');
  month_picker.onclick = () => {
    month_list.classList.add('show')
  }

  let calendar_days = calendar.querySelector('.ctcalendar-days')
  let calendar_header_year = calendar.querySelector('#year')

  let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  calendar_days.innerHTML = ''

  if (month > 11 || month < 0) month = ctcurrDate.getMonth()
  if (!year) year = ctcurrDate.getFullYear()

  month_picker.innerHTML = `${month_names[month]}`
  calendar_header_year.innerHTML = year

  // get first day of month

  let first_day = new Date(year, month, 1)

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement('div')
    if (i >= first_day.getDay()) {
      day.classList.add('ctcalendar-day-cursor')
      day.classList.add('ctcalendar-day-hover')
      day.innerHTML = i - first_day.getDay() + 1
      day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
      day.id = "ctday" + (i - first_day.getDay() + 1);
      if (i - first_day.getDay() + 1 === ctcurrDate.getDate() && year === ctcurrDate.getFullYear() && month === ctcurrDate.getMonth()) {
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




async function openCreatetaskOverlay() {
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
  first_tagbox.textContent = "My Task";
  taglist.appendChild(first_tagbox);


  let taskpage_header = document.getElementById("taskpage_header");
  let img = taskpage_header.lastElementChild;
  img.remove();
  console.log(img)
  taskpage_header.innerHTML += `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin-right:3vw;margin-top:2vw; display: block;" width="44px" height="44px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<g>
  <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1235294117647059s"></animateTransform>
  <circle cx="50" cy="50" r="39.891" stroke="#b4eaed" stroke-width="14.4" fill="none" stroke-dasharray="0 300">
    <animate attributeName="stroke-dasharray" values="15 300;57.89842791548991 300;15 300" keyTimes="0;0.5;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.05682352941176471s"></animate>
  </circle>
  <circle cx="50" cy="50" r="39.891" stroke="#f5fcff" stroke-width="7.2" fill="none" stroke-dasharray="0 300">
    <animate attributeName="stroke-dasharray" values="15 300;57.89842791548991 300;15 300" keyTimes="0;0.5;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.05682352941176471s"></animate>
  </circle>
  <circle cx="50" cy="50" r="32.771" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
    <animate attributeName="stroke-dasharray" values="15 300;47.5643473770655 300;15 300" keyTimes="0;0.5;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.05682352941176471s"></animate>
  </circle>
  <circle cx="50" cy="50" r="47.171" stroke="#000000" stroke-width="1" fill="none" stroke-dasharray="0 300">
    <animate attributeName="stroke-dasharray" values="15 300;69.33558446644277 300;15 300" keyTimes="0;0.5;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="linear" keySplines="0 0.4 0.6 1;0.4 0 1 0.6" begin="-0.05682352941176471s"></animate>
  </circle>
</g>

<g>
  <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1"></animateTransform>
  <path fill="#b4eaed" stroke="#000000" d="M97.2,50.1c0,6.1-1.2,12.2-3.5,17.9l-13.3-5.4c1.6-3.9,2.4-8.2,2.4-12.4"></path>
  <path fill="#f5fcff" d="M93.5,49.9c0,1.2,0,2.7-0.1,3.9l-0.4,3.6c-0.4,2-2.3,3.3-4.1,2.8l-0.2-0.1c-1.8-0.5-3.1-2.3-2.7-3.9l0.4-3 c0.1-1,0.1-2.3,0.1-3.3"></path>
  <path fill="#b4eaed" stroke="#000000" d="M85.4,62.7c-0.2,0.7-0.5,1.4-0.8,2.1c-0.3,0.7-0.6,1.4-0.9,2c-0.6,1.1-2,1.4-3.2,0.8c-1.1-0.7-1.7-2-1.2-2.9 c0.3-0.6,0.5-1.2,0.8-1.8c0.2-0.6,0.6-1.2,0.7-1.8"></path>
  <path fill="#b4eaed" stroke="#000000" d="M94.5,65.8c-0.3,0.9-0.7,1.7-1,2.6c-0.4,0.9-0.7,1.7-1.1,2.5c-0.7,1.4-2.3,1.9-3.4,1.3h0 c-1.1-0.7-1.5-2.2-0.9-3.4c0.4-0.8,0.7-1.5,1-2.3c0.3-0.8,0.7-1.5,0.9-2.3"></path>
</g>
<g>
  <animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" keyTimes="0;1" dur="1.1764705882352942s" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1" begin="-0.1235294117647059s"></animateTransform>
  <path fill="#f5fcff" stroke="#000000" d="M86.9,35.3l-6,2.4c-0.4-1.2-1.1-2.4-1.7-3.5c-0.2-0.5,0.3-1.1,0.9-1C82.3,33.8,84.8,34.4,86.9,35.3z"></path>
  <path fill="#f5fcff" stroke="#000000" d="M87.1,35.3l6-2.4c-0.6-1.7-1.5-3.3-2.3-4.9c-0.3-0.7-1.2-0.6-1.4,0.1C88.8,30.6,88.2,33,87.1,35.3z"></path>
  <path fill="#b4eaed" stroke="#000000" d="M82.8,50.1c0-3.4-0.5-6.8-1.6-10c-0.2-0.8-0.4-1.5-0.3-2.3c0.1-0.8,0.4-1.6,0.7-2.4c0.7-1.5,1.9-3.1,3.7-4l0,0 c1.8-0.9,3.7-1.1,5.6-0.3c0.9,0.4,1.7,1,2.4,1.8c0.7,0.8,1.3,1.7,1.7,2.8c1.5,4.6,2.2,9.5,2.3,14.4"></path>
  <path fill="#f5fcff" d="M86.3,50.2l0-0.9l-0.1-0.9l-0.1-1.9c0-0.9,0.2-1.7,0.7-2.3c0.5-0.7,1.3-1.2,2.3-1.4l0.3,0 c0.9-0.2,1.9,0,2.6,0.6c0.7,0.5,1.3,1.4,1.4,2.4l0.2,2.2l0.1,1.1l0,1.1"></path>
  <path fill="#3b4368" d="M93.2,34.6c0.1,0.4-0.3,0.8-0.9,1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1 C92.4,34.2,93,34.3,93.2,34.6z"></path>
  <path fill="#3b4368" d="M81.9,38.7c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.2,38,81.8,38.4,81.9,38.7z"></path>
  <path fill="#000000" d="M88.5,36.8c0.1,0.3-0.2,0.7-0.6,0.8c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.8C87.9,36.3,88.4,36.4,88.5,36.8z"></path>
  <path stroke="#000000" d="M85.9,38.9c0.2,0.6,0.8,0.9,1.4,0.7c0.6-0.2,0.9-0.9,0.6-2.1c0.3,1.2,1,1.7,1.6,1.5c0.6-0.2,0.9-0.8,0.8-1.4"></path>
  <path fill="#b4eaed" stroke="#000000" d="M86.8,42.3l0.4,2.2c0.1,0.4,0.1,0.7,0.2,1.1l0.1,1.1c0.1,1.2-0.9,2.3-2.2,2.3c-1.3,0-2.5-0.8-2.5-1.9l-0.1-1 c0-0.3-0.1-0.6-0.2-1l-0.3-1.9"></path>
  <path fill="#b4eaed" stroke="#000000" d="M96.2,40.3l0.5,2.7c0.1,0.5,0.2,0.9,0.2,1.4l0.1,1.4c0.1,1.5-0.9,2.8-2.2,2.9h0c-1.3,0-2.5-1.1-2.6-2.4 L92.1,45c0-0.4-0.1-0.8-0.2-1.2l-0.4-2.5"></path>
  <path fill="#000000" d="M91.1,34.1c0.3,0.7,0,1.4-0.7,1.6c-0.6,0.2-1.3-0.1-1.6-0.7c-0.2-0.6,0-1.4,0.7-1.6C90.1,33.1,90.8,33.5,91.1,34.1z"></path>
  <path fill="#000000" d="M85.5,36.3c0.2,0.6-0.1,1.2-0.7,1.5c-0.6,0.2-1.3,0-1.5-0.6C83,36.7,83.4,36,84,35.8C84.6,35.5,85.3,35.7,85.5,36.3z"></path>

</g>
</svg>
  
  
  `



  let alltaglist = await getAllTagList();

  let cat = taskpage_header.lastElementChild;
  taskpage_header.removeChild(cat);
  taskpage_header.appendChild(img)
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
  ctcurr_month = { value: ctcurrDate.getMonth() }
  ctcurr_year = { value: ctcurrDate.getFullYear() }
  regenerateCtCalendar(ctcurr_month.value, ctcurr_year.value);
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
    document.body.removeChild(detailtaskbox)
    deleteTask(id)

    // const c2 = hexToRgb("#A6E4FF");

    // let sidebarbuttons = [...document.getElementsByClassName("myButton")];
    // sidebarbuttons.forEach((b) => {
    //   if (b.style.backgroundColor == c2){

    //     const secondc = b.childNodes[1];
    //     const num = secondc.childNodes[0];
    //     const foradd = document.getElementsByClassName("foraddtask")
    //     setupButton(num,foradd.length)
    //   }

    // })

    //       let todaybtntext = document.getElementById("Today_cnt")
    //   let allbtntext = document.getElementById("All_Tasks_cnt")
    //   let combtntext = document.getElementById("Completed_cnt")
    //   let mcvbtntext = document.getElementById("Mycourseville_cnt")
    //   setupButton(todaybtntext, todaytasks.length)
    // setupButton(allbtntext, allTasks.length)
    // setupButton(mcvbtntext, mcvTask.length)
    // setupButton(combtntext, completedTasks.length)




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
  line1.style = "width:90%; margin-top: 2%; margin-bottom: 2%";
  let line2 = document.createElement("hr");
  line2.style = "width: 90%; margin-top: 2%; margin-bottom: 2%";

  let headBox = document.createElement("div");
  headBox.style = "border-radius: 0.512vw 0.512vw 0px 0px; width: 100%; min-height: 0.985vw";

  let header = document.createElement("div");
  header.id = "mcvdetailtask_header";
  if (now > Date(info.duetime * 1000)) {
    headBox.style.background = "#E63946";
  }
  else {
    headBox.style.background = "#49DFC4";
  }

  let icon = document.createElement("div");
  icon.style = "width: 6vw; height: 6vw; margin: 3%";
  icon.innerHTML = `<img src="${info.icon}" style="width: 100%; height: 100%;"/>`
  console.log(info.icon)
  let title = document.createElement("div");
  title.className = "overview_mycouresvilledetail"
  title.textContent = mcvtitle;
  let close_button = document.createElement("img");
  close_button.src = "image/createtask_close.png";
  close_button.id = "detailtask_close";
  close_button.onclick = function () {
    let detailtaskbox = document.getElementById("mcvdetailtask");
    document.body.removeChild(detailtaskbox);
    closeScreenOverlay();
  }

  header.appendChild(icon);
  header.appendChild(title);
  header.appendChild(close_button);

  let desheader = document.createElement("p");
  desheader.id = "mcvdetailtask_desheader";
  desheader.textContent = info.title;

  let des = document.createElement('div');
  des.className = "mcvdetailtask_des"
  des.innerHTML = info.instruction;

  let bottom = document.createElement("div");
  bottom.style = "display: flex; align-items: center;justify-content: flex-end;padding: 1vw";

  let time = document.createElement("div");
  time.id = "detailtask_deadline";
  let text = document.createElement("p");
  text.innerText = getDateString(new Date(info.duetime * 1000));
  time.appendChild(text);

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
  "Mon": "#FDFFAD",
  "Tue": "#FFADDE",
  "Wed": "#D1FFAD",
  "Thu": "#FFD4AD",
  "Fri": "#ADD8FF",
  "Sat": "#BEADFF",
  "Sun": "#FFB2AD",
}
var colordaybefore = {
  "Tue": "#FDFFAD",
  "Wed": "#FFADDE",
  "Thu": "#D1FFAD",
  "Fri": "#FFD4AD",
  "Sat": "#FFB2AD",
  "Sun": "#ADD8FF",
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



function getNextDateAndMonth(date, smonth, weekday, diff) {
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
  let ranint = Math.floor(Math.random() * ((Math.min(366, diff) - 1) + 1))
  const dateObj = new Date(null, month - 1, date);
  dateObj.setDate(dateObj.getDate() + ranint);
  const nextDate = dateObj.getDate();

  const nextMonth = numberToMonth[dateObj.getMonth() + 1];
  return { nextDate, nextMonth, nextweekday };
}
function getBackDateAndMonth(date, smonth, weekday, diff) {
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
  let ranint = Math.floor(Math.random() * ((Math.min(366, diff) - 1) + 1))
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
  if (hour.length === 1) {
    hour = "0" + hour;
  }
  if (minute.length === 1) {
    minute = "0" + minute;
  }
  return day + " " + month + " " + year + "   " + hour + ":" + minute;
}



/////////////////////////////////////////////////////////////////////



function getTaskInfo(id) { }

let calendar = document.querySelector('.calendar')

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)
}

getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28
}
var dateselected = new Date()
var dayselected = dateselected.getDay()
var monthselected = dateselected.getMonth()
var yearselected = dateselected.getFullYear();



const numberToMonth = {
  1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
  7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
};
function getDaysDifference(day1, month1, year1, day2, month2, year2) {
  // Create Date objects from the input parameters
  const date1 = new Date(year1, month1 - 1, day1);
  const date2 = new Date(year2, month2 - 1, day2);

  // Convert both dates to milliseconds
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();

  // Calculate the difference in milliseconds
  const differenceMs = date2Ms - date1Ms;

  // Convert the difference back to days and return
  const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  return days;
}


function changeSelect(e) {
  const arr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


  console.log(dayselected, monthselected, yearselected)

  let newweekdate = new Date(curr_year.value, curr_month.value, parseInt(e.innerText),);
  let newweekday = arr[newweekdate.getDay()];


  let isRo = isFirstDateLater(dayselected, monthselected + 1, yearselected, parseInt(e.innerText), curr_month.value + 1, curr_year.value)

  let diff = getDaysDifference(dayselected, monthselected + 1, yearselected, parseInt(e.innerText), curr_month.value + 1, curr_year.value)
  dayselected = parseInt(e.innerText)
  monthselected = curr_month.value
  yearselected = curr_year.value

  let forBackend = new Date(yearselected, monthselected, dayselected)
  changeDayPage(forBackend);

  if (isRo) {
    addrotate(dayselected, numberToMonth[monthselected + 1], newweekday, diff);
    console.log(dayselected, numberToMonth[monthselected], newweekday)
  }
  else {
    addrotatere(dayselected, numberToMonth[monthselected + 1], newweekday, diff);
  }

}

function addrotate(sday, smonth, sweekday, diff) {
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
    const { backDate, backMonth, backweekday } = getBackDateAndMonth(date.innerText, month.innerText, weekday.innerText, diff);
    date.innerText = backDate;
    month.innerText = backMonth;
    weekday.innerText = backweekday;

    rweekday.innerText = backweekday;
    rdaynum.innerText = backDate;
    rmonth.innerText = backMonth;
    colorlast.style.backgroundColor = color[backweekday];
    colorone.style.backgroundColor = colordayafter[backweekday];
  }
  h.addEventListener("animationiteration", change);

  h.addEventListener("animationend", () => {
    date.innerText = sday;
    month.innerText = smonth;
    weekday.innerText = sweekday;
    rweekday.innerText = sweekday;
    rdaynum.innerText = sday;
    rmonth.innerText = smonth;

    colorlast.style.backgroundColor = color[weekday.innerText];
    colorone.style.backgroundColor = color[weekday.innerText];
    h.removeEventListener("animationiteration", change);
    h.classList.remove("rotate");
  }, { once: true });
}



function addrotatere(sday, smonth, sweekday, diff) {
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

    const { nextDate, nextMonth, nextweekday } = getNextDateAndMonth(date.innerText, month.innerText, weekday.innerText, diff);
    date.innerText = nextDate;
    month.innerText = nextMonth;
    weekday.innerText = nextweekday;
    rmonth.innerText = nextMonth;
    rweekday.innerText = nextweekday;
    rdaynum.innerText = nextDate;
    colorlast.style.backgroundColor = color[nextweekday];
    colorone.style.backgroundColor = colordayafter[nextweekday];
  }
  r.addEventListener("animationiteration", change);

  r.addEventListener("animationend", () => {
    date.innerText = sday;
    month.innerText = smonth;
    weekday.innerText = sweekday;
    rweekday.innerText = sweekday;
    rdaynum.innerText = sday;
    rmonth.innerText = smonth;

    colorlast.style.backgroundColor = color[weekday.innerText];
    colorone.style.backgroundColor = color[weekday.innerText];
    r.removeEventListener("animationiteration", change);
    r.classList.remove("rotatere");
  }, { once: true });

}

function isFirstDateLater(day1, month1, year1, day2, month2, year2) {
  if (year1 > year2) {
    return true;
  } else if (year1 == year2 && month1 > month2) {
    return true;
  } else if (year1 == year2 && month1 == month2 && day1 > day2) {
    return true;
  } else {
    return false;
  }
}

var currDate = new Date()

generateCalendar = (month, year) => {
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


let curr_month = { value: currDate.getMonth() }
let curr_year = { value: currDate.getFullYear() }




generateCalendar(curr_month.value, curr_year.value);




document.querySelector('#prev-year').onclick = () => {
  --curr_year.value
  generateCalendar(curr_month.value, curr_year.value)
}



document.querySelector('#next-year').onclick = () => {
  ++curr_year.value
  generateCalendar(curr_month.value, curr_year.value)
}




////////////////////////////////////////////////////////

function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function changeColor(button) {
  const c1 = hexToRgb("#F1FAFE");
  const c2 = hexToRgb("#A6E4FF");
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
  addButton.onclick = async function () {

    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tag_name: filterInput.value,
      }),
    }

    const res = await fetch(`http://${IP_ADDRESS}:3000/tag/addTag`, options)
      .then(res => res.json())
      .catch(err => console.log(err))


    let deleteButton = document.createElement("button");
    let filter = document.getElementById("filter").value;
    let checkbox_container = document.getElementById("checkbox-container");
    let checkbox_content = document.createElement('div')



    let checkbox = document.createElement('input');

    checkbox_content.id = "checkbox-content"
    checkbox.type = "checkbox";
    checkbox.className = "filter_checkbox";
    checkbox.id = filter;
    checkbox.name = filter;
    checkbox.value = filter;

    let label = document.createElement('label')
    label.innerText = filter;

    deleteButton.innerText = "X";
    deleteButton.className = "tagDeleteButton";
    deleteButton.onclick = function () {
      deleteTag(res.tag_id);
      checkbox_container.removeChild(checkbox_content)
    }
    checkbox.addEventListener("click", async function () {
      if (checkbox.checked) {
        activeFilters.push(checkbox.value)
      }
      else {
        activeFilters = activeFilters.filter(val => val != checkbox.value)
      }


      const allcurrenttasks = [...document.getElementsByClassName("taskitem")]
      allcurrenttasks.forEach(task => {
        if (activeFilters.every(val => task.tags.includes(val))) {
          task.style.display = ""
        } else {
          task.style.display = "none"
        }
      })
    })






    checkbox_content.appendChild(checkbox);
    checkbox_content.appendChild(label);
    checkbox_content.appendChild(deleteButton);
    checkbox_container.appendChild(checkbox_content);
    document.body.removeChild(container);
    closeScreenOverlay();








  }
  buttonContainer.appendChild(addButton);
  container.appendChild(buttonContainer);
  openScreenOverlay();

  document.body.appendChild(container);
}

async function deleteTag(tag_id) {
  const options = {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tag_id: tag_id
    })
  }
  try {
    const res = await fetch(`http://${IP_ADDRESS}:3000/tag/deleteTag`, options);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}