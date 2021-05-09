// Game message control
function send_message(message_text, btn_text) {
    const message_wrapper = document.querySelector(".message_wrapper");
    message_wrapper.style.display = 'flex';
    const message = document.querySelector(".message .text");
    message.innerHTML = message_text;
    const btn = document.querySelector(".message_btn");
    btn.innerHTML = btn_text;
}

document.querySelector(".message_btn").addEventListener("click", () => {
    document.querySelector(".message_wrapper").style.display = "none";
})

// Game variables

const board = document.querySelector(".board");
const grids = Array.from(document.querySelectorAll(".grids"));
let player_turn = "human";
let isGameOver = false;
const gameArray = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
const playerDescription = {
    "human": -1,
    "ai": 1,
    "none": 0
};
const color = {
    "human": "pink",
    "ai": "purple"
}

// Game utitlity functions
function checkGameOver(arr = gameArray, check_enable = false) {
    //Check for horizontal rows
    let sum = 0;
    let filled_grids = true;
    for (let i = 0; i < 3; i++) {
        sum = 0;
        for (let j = 0; j < 3; j++) {
            sum += arr[i][j];
            if (arr[i][j]) {
                filled_grids = false;
            }
        }
        if (sum == 3 || sum == -3) {
            isGameOver = true;
            if (check_enable) {
                send_message(player_turn + "Is the winner", "Reload to play");
            }
            return playerDescription[player_turn];
        }
    }
    if (filled_grids) {
        isGameOver = true;
        if (check_enable) {
            send_message("Match tied!!", "Reload to play");
        }
        return playerDescription["none"];
    }

    //Check for vertical columns
    for (let i = 0; i < 3; i++) {
        sum = 0;
        for (let j = 0; j < 3; j++) {
            sum += arr[j][i];
        }
        if (sum == 3 || sum == -3) {
            isGameOver = true;
            if (check_enable) {
                send_message(player_turn + " is the winner", "Reload to play");
            }
            return playerDescription[player_turn];
        }
    }

    //Check for diagonal 1
    sum = 0;
    for (let i = 0; i < 3; i++) {
        sum += arr[i][i];
    }
    if (sum == 3 || sum == -3) {
        isGameOver = true;
        if (check_enable)
        {
            send_message(player_turn + " Is the winner", "Reload to play");
        }
        return playerDescription[player_turn];
    }

    //Check for diagonal 2
    sum = 0;
    for (let i = 0; i < 3; i++) {
        sum += arr[i][3 - i];
    }
    if (sum == 3 || sum == -3) {
        isGameOver = true;
        if(check_enable)
        {
            send_message(player_turn + " Is the winner", "Reload to play");
        }
        return playerDescription[player_turn];
    }
    return playerDescription["none"]
}

function createChecker(color) {
    if (color == "pink" || color == "purple") {
        const checker = document.createElement('div');
        checker.classList.add("checker");
        checker.classList.add(color);
        return checker;
    }
}

function makeMove(x, y, player) {
    console.log(x,y);
    gameArray[x][y] = playerDescription[player];
    let checker = createChecker(color[player]);
    grids[x * 3 + y].appendChild(checker);
}

function validateMove(x, y, arr = gameArray) {
    if (arr[x][y]) {
        return false;
    }
    return true;
}

function getPossibleMoves(arr = gameArray) {
    let available = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!(arr[i][j])) {
                available.push(i * 3 + j)
            }
        }
    }
    return available;
}

//Attaching the game loop
grids.forEach((grid) => {
    grid.addEventListener("click", () => {
        let data = grid.getAttribute("data");
        let x = parseInt(data / 3);
        let y = data % 3;
        if (validateMove(x, y) && (!isGameOver)) {
            makeMove(x, y, player_turn);
            checkGameOver(arr=gameArray,check_enable=true);
            if (player_turn == "human") {
                player_turn = "ai";
                aiMove();
            } else if (player_turn == "ai") {
                console.log("I am AI")
                player_turn = "human";
            }
        } else {
            send_message("Cannot make a move there", "Got it!")
        }
    })
})



// AI moves

function minMax(arr, depth, isMax) {
    if (checkGameOver(arr) || depth > 10) {
        // console.log(depth);
        return checkGameOver(arr);
    }
    if (isMax) {
        let bestVal = -Infinity;
        let available = getPossibleMoves(arr);
        for (let i = 0; i < available.length; i++) {
            arr[parseInt(available[i] / 3), available[i] % 3] = 1;
            bestVal = Math.max(minMax(arr, depth + 1, false), bestVal);
            // console.log(bestVal);
        }
        return bestVal;
    } else {
        let bestVal = Infinity;
        let available = getPossibleMoves(arr);
        for (let i = 0; i < available.length; i++) {
            arr[parseInt(available[i] / 3), available[i] % 3] = 1;
            bestVal = Math.min(minMax(arr, depth + 1, true), bestVal);
        }
        return bestVal;
    }
}


function aiMove() {
    let arr = gameArray.slice();
    let available = getPossibleMoves(arr);
    let bestVal = -Infinity;
    let val = -Infinity;
    let bestMove = available[0];
    console.log("Available for AI",available);
    for (let i = 0; i < available.length; i++) {
        arr[parseInt(available[i] / 3), available[i] % 3] = 1;
        val = minMax(arr, 0, true);
        if (bestVal < val) {
            bestVal = null;
            bestMove = available[i];
        }
        arr[parseInt(available[i] / 3), available[i] % 3] = 0;
        // console.log("Hello",val);
    }
    let grid = grids[bestMove];
    console.log("MY location",parseInt(bestMove / 3), bestMove % 3)
    console.log("Move at", bestMove, player_turn,grid,grid.getAttribute("data"));
    console.log("Before ai",gameArray);
    isGameOver = false;
    grid.click();
    console.log("After ai",gameArray);
}