let hiscore = localStorage.getItem("hiscoreBox");
let hival;
if (hiscore === null) {
    hival = 0;
    localStorage.setItem("hiscoreBox", JSON.stringify(hival));
} else {
    hival = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore:" + hiscore;
}
let inputdir = { x: 0, y: 0 };
let speed = 7;
let score = 0;
let lastPaintTime = 0;

let snakeArr = [{ x: 15, y: 15 }];
let food = { x: 10, y: 10 };

const diff = document.getElementById('difficultySelect');

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snarr) {
    // if you collide it
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }
    // in the wall
    if ((snakeArr[0].x >= 30 || snakeArr[0].x <= 0) || (snakeArr[0].y >= 30 || snakeArr[0].y <= 0)) {
        return true;
    }
}

function gameEngine() {
    // updating the snake and food
    if (isCollide(snakeArr)) {
        inputdir = { x: 0, y: 0 };
        alert("GAME OVER BABES!! PRESS ANY KEY TO CONTINUE");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score:" + score;
        diff.disabled = false; // Enable dropdown when game is over
    }

    // if you have eaten the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        snakeArr.unshift({ x: snakeArr[0].x + inputdir.x, y: snakeArr[0].y + inputdir.y });
        score += 1;
        if (score > hival) {
            hival = score;
            localStorage.setItem("hiscoreBox", JSON.stringify(hival));
            hiscoreBox.innerHTML = "HiScore:" + hival;
        }
        scoreBox.innerHTML = "Score:" + score;
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }
    // moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputdir.x;
    snakeArr[0].y += inputdir.y;

    // Display the snake and food

    // display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeEle = document.createElement("div");
        snakeEle.style.gridRowStart = e.y;
        snakeEle.style.gridColumnStart = e.x;

        if (index == 0) {
            snakeEle.classList.add("head");
        } else {
            snakeEle.classList.add("snake");
        }
        board.appendChild(snakeEle);
    });

    // display the food
    foodele = document.createElement("div");
    foodele.style.gridRowStart = food.y;
    foodele.style.gridColumnStart = food.x;

    foodele.classList.add("food");
    board.appendChild(foodele);
}

window.requestAnimationFrame(main);

window.addEventListener("keydown", e => {
    inputdir = { x: 0, y: 1 };

    switch (e.key) {
        case "ArrowUp":
            inputdir.x = 0;
            inputdir.y = -1;
            break;

        case "ArrowDown":
            inputdir.x = 0;
            inputdir.y = 1;
            break;

        case "ArrowLeft":
            inputdir.x = -1;
            inputdir.y = 0;
            break;

        case "ArrowRight":
            inputdir.x = 1;
            inputdir.y = 0;
            break;

        default:
            break;
    }
});

document.addEventListener('DOMContentLoaded', (e) => {
    diff.addEventListener('change', (ev) => {
        if (!diff.disabled) { // Check if dropdown is enabled
            const val = ev.target.value;
            switch (val) {
                case 'easy':
                    speed = 7;
                    break;
                case 'medium':
                    speed = 11;
                    break;
                case 'hard':
                    speed = 15;
                    break;
                default:
                    break;
            }
        }
    });
});

// Disable dropdown when game starts
document.addEventListener("keydown", e => {
    if (inputdir.x !== 0 || inputdir.y !== 0) {
        diff.disabled = true; // Disable dropdown when game starts
    }
});
