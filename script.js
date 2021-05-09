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
let isGameOver=false;
const gameArray = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];
const playerDescription = {"human":-1,"ai":1,"none":0};
const color = {"human":"pink","ai":"purple"}

// Game utitlity functions
function checkGameOver(){
    //Check for horizontal rows
    let sum=0;
    let filled_grids=true;
    for(let i=0;i<5;i++)
    {
        sum=0;
        for(let j=0;j<5;j++)
        {
            sum+=gameArray[i][j];
            if(gameArray[i][j])
            {
                filled_grids=false;
            }
        }
        if(sum==5 || sum==-5)
        {
            isGameOver=true;
            send_message(player_turn+"Is the winner","Reload to play");
        }
    }
    if(filled_grids)
    {
        isGameOver=true;
        send_message("Match tied!!","Reload to play");
    }

    //Check for vertical columns
    for(let i=0;i<5;i++)
    {
        sum=0;
        for(let j=0;j<5;j++)
        {
            sum+=gameArray[j][i];
        }
        if(sum==5 || sum==-5)
        {
            isGameOver=true;
            send_message(player_turn+" is the winner","Reload to play");
        }
    }

    //Check for diagonal 1
    sum=0;
    for(let i=0;i<5;i++)
    {
        sum+=gameArray[i][i];
    }
    if(sum==5 || sum==-5)
    {
        isGameOver=true;
        send_message(player_turn+"Is the winner","Reload to play");
    }

    //Check for diagonal 2
    sum=0;
    for(let i=0;i<5;i++)
    {
        sum+=gameArray[i][5-i];
    }
    if(sum==5 || sum==-5)
    {
        isGameOver=true;
        send_message(player_turn+"Is the winner","Reload to play");
    }
}
function createChecker(color) {
    if (color == "pink" || color == "purple") {
        const checker = document.createElement('div');
        checker.classList.add("checker");
        checker.classList.add(color);
        return checker;
    }
}

function makeMove(x,y,player)
{
    gameArray[x][y]=playerDescription[player];
    let checker = createChecker(color[player]);
    grids[x*5+y].appendChild(checker);
}

function validateMove(x,y)
{
    if (gameArray[x][y])
    {
        return false;
    }
    return true;
}


//Attaching the game loop
grids.forEach((grid)=>{
    grid.addEventListener("click",()=>{
        let data = grid.getAttribute("data");
        let x = parseInt(data/5);
        let y = data%5;
        if(validateMove(x,y)&&(!isGameOver))
        {
            makeMove(x,y,player_turn);
            checkGameOver();
            if(player_turn=="human"){
                player_turn="ai";
            }
            else if(player_turn=="ai"){
                player_turn="human";
            }
        }
        else{
            send_message("Cannot make a move there","Got it!")
        }
    })
})