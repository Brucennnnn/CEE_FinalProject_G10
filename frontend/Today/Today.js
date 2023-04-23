const button = document.getElementById("myButton");
const circle = document.getElementById("circle");
const circleNumber = document.getElementById("circle-number");
const text = document.getElementById("text");
let numberTask = 0;

const c1 = "white";
const c2 = "#8BDCFF";

// circle.appendChild(circleNumber);
// circleNumber.innerHTML = numberTask;

// button.appendChild(circle);
// button.appendChild(text);

function changeColor() {
    button.classList.toggle("clicked");
    circle.classList.toggle("clicked");
    if (circle.style.backgroundColor === c1) {
      circle.style.backgroundColor = c2;
      button.style.backgroundColor = c1;
    } else {
      circle.style.backgroundColor = c1;
      button.style.backgroundColor = c2;
    }
}

function PageChange() {
  circleNumber.innerHTML = numberTask;
}

button.addEventListener("click", changeColor);
button.addEventListener("click", PageChange);