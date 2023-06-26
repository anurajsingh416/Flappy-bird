// step 1: draw board of 360 x 640
// step 2: draw bird w.r.t. the board with context
// step 3: draw top and bottom pipes at the end of frame
// step 4: call update() and recurr it till game is over
// step 5: place pipes using placePipes() function at 1.5s
// step 6: make birds fly using velocityY and gravity
// step 7: apply conditions for collision detection using detectCollision()


let board;
let boardWidth=360;
let boardHeight=640;
let context;

let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let birdImg;

let bird={
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

let pipeArray=[];
let pipeX=boardWidth;
let pipeY=0;
let pipeWidth=64;
let pipeHeight=512;

let topPipeImg;
let bottomPipeImg;

let velocityX=-2;
let velocityY=0;
let gameover=false;
let gravity=0.4;

let score=0;

window.onload=function(){
    board=document.getElementById('board');
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext('2d');

    // context.fillStyle="green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    birdImg=new Image();
    birdImg.src="./flappybird.png"
    birdImg.onload=function(){
    context.drawImage(birdImg, bird.x, bird.y, bird.width,bird.height);
    }

    topPipeImg=new Image();
    topPipeImg.src="./toppipe.png"

    bottomPipeImg=new Image();
    bottomPipeImg.src="./bottompipe.png"

    requestAnimationFrame(update);
    setInterval(placePipes,1500);
    document.addEventListener('keydown',moveBird);
    document.addEventListener('click',moveBirdclick);
}

function update(){
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    // bird.y+=velocityY; 
    velocityY+=gravity;      
    bird.y=Math.max(bird.y + velocityY,0);
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    
    if(bird.y>board.height){
        gameover=true;
    }
    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x+pipe.width){
            score+=0.5;
            pipe.passed=true;
        }
        if(detectCollision(bird,pipe)){
            gameover=true;
        }
        while(pipeArray.length>0 && pipeArray[0].x< -pipeWidth){
            pipeArray.shift();
        }
    }
    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(`Score ${score}`,15,50);

    if(gameover){
    context.fillStyle="white";
    context.font="50px sans-serif";
    context.fillText("Game Over",50,300);
    context.font="30px sans-serif";
    context.fillText("Click to play Again",46,360);
    }
}

function placePipes(){
    if(gameover){
        return;
    }
    let randomPipeY=pipeY-pipeHeight/4-(Math.random()*pipeHeight/2);
    let openingSpace=board.height/4;

    let toppipe={
        img:topPipeImg,
        x:pipeX,
        y:randomPipeY,
        height:pipeHeight,
        width:pipeWidth,
        passed:false
    }
    pipeArray.push(toppipe);
    let bottompipe={
        img:bottomPipeImg,
        x:pipeX,
        y:openingSpace+randomPipeY+pipeHeight,
        height:pipeHeight,
        width:pipeWidth,
        passed:false
    }
    pipeArray.push(bottompipe);
}

function moveBird(e){
    if(e.code==='Space'||e.code==='ArrowUp'){
        velocityY=-6;

        if(gameover){
            gameover=false;
            pipeArray=[];
            score=0;
            bird.y=birdY;
        }
    }
}
function moveBirdclick(){
        velocityY=-6;

        if(gameover){
            gameover=false;
            pipeArray=[];
            score=0;
            bird.y=birdY;
        }
    }


function detectCollision(a,b){
    return a.x<b.x+b.width &&
            a.x+a.width>b.x &&
            a.y<b.y+b.height &&
            a.y+a.height>b.y;
}
