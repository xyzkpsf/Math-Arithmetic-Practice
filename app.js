let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");
let pauseButton = document.getElementById("pause");
let submitButton = document.getElementById("submit");
let checkButton = document.getElementById("check");
let clock = document.getElementById("timer");
let begin = false;
let pause = false;
let timeCount = 0;
let timer = null;
let qNum;
let vRan1;
let vRan2;
let vRan3;
let addOpe;
let subOpe;
let mulOpe;
let divOpe;
let negOpe;
let operations = ["+", "-", "*", "/"];
let selectOper;
let opeArr;
let ansArr = [];
let allCorrect = false;
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");

startButton.addEventListener("click", () => {
  if (!begin) start();
  if (pause) {
    pause = false;
    setTime();
    cellElements.forEach((cell, index) => {
      if (index < qNum) cell.classList.add("SHOW");
    });
  }
});

pauseButton.addEventListener("click", () => {
  if (begin) {
    pause = true;
    clearInterval(timer);
    startButton.innerText = "Resume";
    cellElements.forEach((cell, index) => {
      if (index < qNum) cell.classList.remove("SHOW");
    });
  }
});

submitButton.addEventListener("click", () => {
  checkAnswer();
});

checkButton.addEventListener("click", () => {
  if (begin && confirm("Are you sure you want to show the answer?")) {
    cellElements.forEach((cell, index) => {
      if (index < qNum) {
        cell.children[0].value = ansArr[index];
      }
    });
    startButton.classList.add("hide");
    submitButton.classList.add("hide");
    pauseButton.classList.add("hide");
    checkButton.classList.add("hide");
  }
});

resetButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset everything?")) {
    cellElements.forEach((cell, index) => {
      if (index < qNum) {
        if (cell.classList.contains("WRONG")) {
          cell.classList.remove("WRONG");
        }
      }
    });
    begin = false;
    ansArr = [];
    start();
  }
});

function start() {
  begin = true;
  cellElements.forEach((cell) => {
    cell.classList.remove("SHOW");
  });
  getValue();
  clearInterval(timer);
  setTime();
  setQuestion();
  startButton.classList.remove("hide");
  submitButton.classList.remove("hide");
  pauseButton.classList.remove("hide");
  checkButton.classList.remove("hide");
}

function setTime() {
  if (startButton.innerText === "Start") {
    timeCount = 0;
  }
  if (startButton.innerText === "Resume") {
    startButton.innerText = "Start";
  }

  timer = setInterval(() => {
    timeCount++;
    var hour = parseInt(timeCount / (60 * 60 * 60));
    var min = parseInt(timeCount / (60 * 60));
    var sec = parseInt((timeCount / 60) % 60);
    clock.innerText = toDub(hour) + ":" + toDub(min) + ":" + toDub(sec);
  }, 1000 / 60);
}

function toDub(n) {
  return n < 10 ? "0" + n : "" + n;
}

function getValue() {
  qNum = document.getElementById("qNum").value;
  vRan1 = Math.pow(10, document.getElementById("vRan1").value);
  vRan2 = Math.pow(10, document.getElementById("vRan2").value);
  vRan3 = Math.pow(10, document.getElementById("vRan3").value);
  addOpe = document.getElementById("add").checked;
  subOpe = document.getElementById("sub").checked;
  mulOpe = document.getElementById("mul").checked;
  divOpe = document.getElementById("div").checked;
  negOpe = document.getElementById("neg").checked;
}

function setQuestion() {
  var opers = [];
  selectOper = [addOpe, subOpe, mulOpe, divOpe].forEach((element, index) => {
    if (element) opers.push(index);
  });
  opeArr = Array.from(
    { length: qNum },
    () => opers[Math.floor(Math.random() * opers.length)]
  );
  // First and Second number in + or - quetions
  let addSubArr_1 = Array.from(
    { length: qNum },
    () => Math.floor(Math.random() * vRan1) + 1
  );
  let addSubArr_2 = Array.from(
    { length: qNum },
    () => Math.floor(Math.random() * vRan1) + 1
  );

  // First and Second number in * or / quetions
  let mulArr_1 = Array.from(
    { length: qNum },
    () => Math.floor(Math.random() * vRan2) + 1
  );
  let mulArr_2 = Array.from(
    { length: qNum },
    () => Math.floor(Math.random() * vRan2) + 1
  );

  let divArr_1 = Array.from(
    { length: qNum },
    () => Math.floor(Math.random() * vRan3) + 1
  );
  let divArr_2 = Array.from(
    { length: qNum },
    () => Math.floor(Math.random() * vRan3) + 1
  );

  cellElements.forEach((cell, index) => {
    if (index < qNum) {
      cell.classList.add("SHOW");
      var num1;
      var num2;
      if (opeArr[index] == 0 || opeArr[index] == 1) {
        num1 = addSubArr_1[index];
        num2 = addSubArr_2[index];
        if (!negOpe && opeArr[index] == 1 && num1 < num2) {
          num2 = Math.floor(Math.random() * num1);
        }
      } else {
        if (opeArr[index] == 2) {
          num1 = mulArr_1[index];
          num2 = mulArr_2[index];
        } else {
          num1 = divArr_1[index] * divArr_2[index];
          num2 = divArr_2[index];
        }
        if (negOpe) {
          if (Math.random() > 0.5) num1 *= -1;
          if (Math.random() > 0.5) num2 *= -1;
        }
      }
      let num1String = num1 < 0 ? "(" + num1 + ") " : num1;
      let num2String = num2 < 0 ? "(" + num2 + ") " : num2;

      cell.textContent =
        num1String + " " + operations[opeArr[index]] + " " + num2String + "=";
      var inputBox = document.createElement("input");
      cell.appendChild(inputBox);
      var ans;
      switch (opeArr[index]) {
        case 0:
          ans = num1 + num2;
          break;
        case 1:
          ans = num1 - num2;
          break;
        case 2:
          ans = num1 * num2;
          break;
        case 3:
          ans = num1 / num2;
          break;
      }
      ansArr.push(ans);
    }
  });
}

function checkAnswer() {
  allCorrect = true;
  cellElements.forEach((cell, index) => {
    if (index < qNum) {
      if (ansArr[index] != cell.children[0].value) {
        allCorrect = false;
        cell.classList.add("WRONG");
      } else if (cell.classList.contains("WRONG")) {
        cell.classList.remove("WRONG");
      }
    }
  });
  if (allCorrect) {
    clearInterval(timer);
    clock.innerText = "(ᵔᴥᵔ) " + "Good Job!" + " (ᵔᴥᵔ)";
  }
}

function isPrime(num) {
  for (var i = 2; i < num; i++) if (num % i === 0) return false;
  return num > 1;
}
