const gameContainer=document.querySelector(".game-container");
const resetBtn=document.getElementById("reset-btn");
const winningMsgModal=document.getElementById("winning-msg-modal");
const winningMsgContainer=document.getElementById("winning-msg");
const overlay=document.getElementById("overlay");
const closeBtn=document.getElementById("close-btn");
const player=document.getElementById("player");
const secondPlayer=document.getElementById("second-player");
const secondPlayerName=document.getElementById("second-player-name");
const playWithComputerBtn=document.getElementById("play-with-computer-btn");
const playWithFrienddBtn=document.getElementById("play-with-friend-btn");
const home=document.getElementById("mode");
const main=document.querySelector("main");
const playAgainBtn=document.getElementById("play-again-btn");
const firstPlayerScoreEl=document.getElementById("first-player-score");
const secondPlayerScoreEl=document.getElementById("second-player-score");
const soundIcon=document.getElementById("sound-icon");
const homeIcon=document.getElementById("home-icon");
const emoji=document.getElementById("emoji");



const matchingStates=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let currentPlayer="X";
let leftOverTurns=[0,1,2,3,4,5,6,7,8];
let playerTurns=[];
let computerTurns=[];
let secondPlayerTurns=[];
let isComputerThinking = false;
let gameOver=false;
let firstPlayerScore=0;
let secondPlayerScore=0;
let isMute=false;
let mode;





const playingClickAudio=new Audio("audios/mixkit-cool-interface-click-tone-2568.wav");
const clickAudio=new Audio("audios/universfield-computer-mouse-click-02-383961.mp3");
const backingHomePageAudio=new Audio("audios/mixkit-mouse-click-close-1113.wav");
const popSound=new Audio("audios/dragon-studio-pop-402324.mp3");
const winningSound=new Audio("audios/universfield-game-bonus-144751.mp3");
const losingSound=new Audio("audios/mixkit-losing-piano-2024.wav");
const gameDrawSound=new Audio("audios/alphix-game-over-417465.mp3");





const setTurn=(id,clickedBox)=>{
  clickedBox.innerHTML = `<span class="mark">${currentPlayer}</span>`;
  if(currentPlayer==="X"){
    playerTurns.push(Number(id.slice(3)));
  }else if(currentPlayer==="O" && mode==="with friend"){
    secondPlayerTurns.push(Number(id.slice(3)));
  }
  currentPlayer=currentPlayer==="O"?"X":"O";
  leftOverTurns=leftOverTurns.filter(num=>num!==Number(id.slice(3)));

  if(mode==="with friend"){
    if(currentPlayer==="O"){
      player.classList.remove("select");
      secondPlayer.classList.add("select");
    }else{
      player.classList.add("select");
      secondPlayer.classList.remove("select");
    }
  }
}



const setComputerTurn=()=>{
  if(currentPlayer==="X" || gameOver) return;
  let randomNum=leftOverTurns[Math.floor(Math.random()*leftOverTurns.length)];

  matchingStates.forEach(state=>{
    if(playerTurns.includes(state[0]) && playerTurns.includes(state[1]) && !computerTurns.includes(state[2])){
      randomNum=state[2];
    }else if(playerTurns.includes(state[2]) && playerTurns.includes(state[1]) && !computerTurns.includes(state[0])){
      randomNum=state[0];
    }else if(playerTurns.includes(state[2]) && playerTurns.includes(state[0]) && !computerTurns.includes(state[1])){
      randomNum=state[1];
    }
  });

  matchingStates.forEach(state=>{
    if(computerTurns.includes(state[0]) && computerTurns.includes(state[1]) && !playerTurns.includes(state[2])){
      randomNum=state[2];
    }else if(computerTurns.includes(state[2]) && computerTurns.includes(state[1]) && !playerTurns.includes(state[0])){
      randomNum=state[0];
    }else if(computerTurns.includes(state[2]) && computerTurns.includes(state[0]) && !playerTurns.includes(state[1])){
      randomNum=state[1];
    }
  });
  
  addAudio(playingClickAudio);
  const randomBoxId="box"+`${randomNum}`;
  const randomBox=document.getElementById(randomBoxId);
  randomBox.innerHTML = `<span class="mark">${currentPlayer}</span>`;
  currentPlayer=currentPlayer==="O"?"X":"O";
  computerTurns.push(randomNum);
  leftOverTurns=leftOverTurns.filter(num=>num!==randomNum);
  isComputerThinking = false;
  player.classList.add("select");
  secondPlayer.classList.remove("select");
}





const checkWinner=()=>{

  if(gameOver) return;

  for (let eachState of matchingStates){
    if(playerTurns.includes(eachState[0]) && playerTurns.includes(eachState[1]) && playerTurns.includes(eachState[2])){
      winningMsgContainer.textContent=mode==="with computer"?'You won this game!':'Player X won this game!';
      emoji.src="icons/birthday-emoji.png";
      firstPlayerScore=firstPlayerScore+1;
      firstPlayerScoreEl.textContent=firstPlayerScore;
      gameOver=true;
      setWinAnimation(eachState[0],eachState[1],eachState[2],winningSound);
      break;
      return;
    }else if(mode==="with computer" && computerTurns.includes(eachState[0]) && computerTurns.includes(eachState[1]) && computerTurns.includes(eachState[2])){
      winningMsgContainer.textContent='Computer won this game!';
      emoji.src="icons/facebook-reactions.png";
      secondPlayerScore=secondPlayerScore + 1;
      secondPlayerScoreEl.textContent=secondPlayerScore;
      gameOver=true;
      setWinAnimation(eachState[0],eachState[1],eachState[2],losingSound);
      break;
      return;
    }else if(mode==="with friend" && secondPlayerTurns.includes(eachState[0]) && secondPlayerTurns.includes(eachState[1]) && secondPlayerTurns.includes(eachState[2])){
      winningMsgContainer.textContent='Player O won this game!';
      emoji.src="icons/birthday-emoji.png";
      secondPlayerScore=secondPlayerScore + 1;
      secondPlayerScoreEl.textContent=secondPlayerScore;
      gameOver=true;
      setWinAnimation(eachState[0],eachState[1],eachState[2],winningSound);
      break;
      return;
    }
  };

if(!gameOver&&leftOverTurns.length===0){
      winningMsgContainer.textContent='This was a draw!';
      emoji.src="icons/sad-face.png";
      gameOver=true;

      gameDrawSound.currentTime = 0;
      gameDrawSound.play();
      setTimeout(() => {
        gameDrawSound.pause();
      }, 1500); 

      winningMsgModal.hidden=false;
      overlay.hidden=false;
      return;
    };
};





gameContainer.addEventListener("click",event=>{
  if (!event.target.id || isComputerThinking || gameOver) return;
  addAudio(playingClickAudio);
  const id=event.target.id;
  const clickedBox=document.getElementById(id);
  if(clickedBox.innerHTML!=="") return;
  setTurn(id,clickedBox);

  setTimeout(() => {
    checkWinner();
  }, 100);

  if(mode==="with computer"){
    isComputerThinking = true;
    player.classList.remove("select");
    secondPlayer.classList.add("select");
    setTimeout(() => {
      setComputerTurn();
    }, 800); 
    setTimeout(() => {
      checkWinner();
    }, 900);
  }

});




const resetGame=()=>{
  playerTurns=[];
  computerTurns=[];
  secondPlayerTurns=[];
  leftOverTurns=[0,1,2,3,4,5,6,7,8];
  isComputerThinking = false;
  gameOver=false;
  currentPlayer="X";
    player.classList.add("select");
    secondPlayer.classList.remove("select");

  for (let x=0;x<=8;x++){
    const box=document.getElementById(`box${x}`);
    box.textContent="";
  }
}


resetBtn.addEventListener("click",()=>{
  resetGame();
  addAudio(clickAudio);
});

overlay.addEventListener("click",()=>{
  winningMsgModal.hidden=true;
  overlay.hidden=true;
});



closeBtn.addEventListener("click",()=>{
  addAudio(clickAudio);
  winningMsgModal.hidden=true;
  overlay.hidden=true;
});



playWithComputerBtn.addEventListener("click",()=>{
  addAudio(clickAudio);
  home.classList.add("hidden");
  main.hidden=false;
  mode="with computer";
  secondPlayerName.textContent="Computer O";
  homeIcon.innerHTML=`<img src="icons/home.png" alt="home icon">`;
});


playWithFrienddBtn.addEventListener("click",()=>{
  addAudio(clickAudio);
  home.classList.add("hidden");
  main.hidden=false;
  mode="with friend";
  secondPlayerName.textContent="Player O";
  homeIcon.innerHTML=`<img src="icons/home.png" alt="home icon">`;
});

playAgainBtn.addEventListener("click",()=>{
  addAudio(clickAudio);
  winningMsgModal.hidden=true;
  overlay.hidden=true;
  resetGame();
});




soundIcon.addEventListener("click",()=>{
  addAudio(clickAudio);
  isMute=isMute?false:true;
  if (!isMute) {
    soundIcon.src = "icons/volume-up.png";
  } else {
    soundIcon.src = "icons/mute.png";
  }
});



homeIcon.addEventListener("click",()=>{
  addAudio(backingHomePageAudio);
  resetGame();
  home.classList.remove("hidden");
  main.hidden=true;
  homeIcon.innerHTML=``;
  firstPlayerScore=0;
  secondPlayerScore=0;
  firstPlayerScoreEl.textContent="_";
  secondPlayerScoreEl.textContent="_";
});



const addAudio=audio=>{
  if(isMute) return;
  audio.currentTime = 0;
  audio.play();
}


const setWinAnimation=(first,second,third,sound)=>{

  let firstBox=document.getElementById(`box${first}`);
  let secondBox=document.getElementById(`box${second}`);
  let thirdBox=document.getElementById(`box${third}`);

  firstBox.classList.add("winning-animation");
  addAudio(popSound);
  setTimeout(()=>{
    secondBox.classList.add("winning-animation");
    addAudio(popSound);
  },1000);
  setTimeout(()=>{
    thirdBox.classList.add("winning-animation");
    addAudio(popSound);
  },2000);


  setTimeout(()=>{
    winningMsgModal.hidden=false;
    overlay.hidden=false;
    addAudio(sound);
    firstBox.classList.remove("winning-animation");
    secondBox.classList.remove("winning-animation");
    thirdBox.classList.remove("winning-animation");
  },3000);
}















