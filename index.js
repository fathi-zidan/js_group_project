const msgBoard = document.getElementById("msgBoard");
const startBtn = document.getElementById("startBtn");
const gameTimeNum = document.getElementById("gameTimeNum");
const teamAScore = document.getElementById("teamAScore");
const teamBScore = document.getElementById("teamBScore");
const teamScore = document.getElementById("teamScore");
const goalAudio = document.getElementById("goalAudio");
const foulAudio = document.getElementById("foulAudio");
/*
    INSTRUCTIONS
    ** game
        the game time is taken from the constants.js file
        run time that will start from 0 until the gameTime value.
        foreach 1 game second wait 5 real seconds.
        when the game time reaches the gameTime value - stop the game, summarize it and stop generating events.
        every eventEveryXtime amount of time (while the game is running) - generate random event.
        
    ** events
        you should have 8 types of events - for example: playerX scored, playerY committed a foul, timeout, rebounds, assist, ect.
        define the events in eventTypes in constants.js.
        every X amount of time (measure it!) - defined in eventEveryXtime in constants, generate a random event.
        log this event using updateMsg functions, and update the correct data.
        for example:
        if player X scored, update team score, and update player personal score.
    ** UI
        add at least one animation (ball jumping around, chear team etc).
        add at least one sound effect
    
    ** general
        generate any additional functions that you need.
        make sure that the flow is logical.
        make the code modular - you can move functions into different files. make sure that the 
        file names are logical and the folder names is logical and nicely organized.
*/
startBtn.addEventListener("click", startGame);
function startGame() {
  updateMsg("start game!");

  //RESET
  msgBoard.style.fontSize =  "4em";
  msgBoard.style.padding =  "4rem";
  teamAScore.textContent = 0;
  teamBScore.textContent = 0;
//   teamA.length = 0;
//   teamB.length = 0;
teamA.splice(0,teamA.length);
teamB.splice(0,teamB.length);

  generateTeams();
  let totalTime = 0;
  // start timer, generate random events, update date accordingly until game is done.
  let currentEventTimer = 0;
  let gameInterval = setInterval(function () {
    if (totalTime < gameTime) {
      // generate events if X amount of time passed from the last event.
      totalTime += 1;
      updateGameTime(totalTime);
      currentEventTimer++;
      if(currentEventTimer >= eventEveryXtime){
        currentEventTimer = 0;
        generateEvent();
      }
      
      
    } else {
      clearInterval(gameInterval);
      updateMsg("game over!");
      // summarize the game
      const teamAScoreNum = teamAScore.innerHTML;
      const teamBScoreNum = teamBScore.innerHTML;
      if (teamAScoreNum > teamBScoreNum) {
        updateMsg("Team A WON " + teamAScoreNum);
      } else if (teamAScoreNum < teamBScoreNum) {
        updateMsg("Team B WON " + teamBScoreNum);
      } else {
        updateMsg("It is Tie " + teamAScoreNum);
      }
      msgBoard.style.fontSize =  "100%";
    //   msgBoard.style.fontSize =  "30px";
    //   msgBoard.style.paddingTop =  "5px";
      msgBoard.innerText += '\n' +"Team A";
      teamA.forEach(player => {
        if(player.Points > 0){
          msgBoard.innerText += '\n' +` ${player.FirstName} ${player.LastName} Scores ${player.Points}`;
        }
        if(player.Fouls > 0){
          msgBoard.innerText += '\n' +` ${player.FirstName} ${player.LastName} has ${player.Fouls} fouls`;
        }
      });
      msgBoard.innerText += '\n' +"Team B";
      teamB.forEach(player => {
        if(player.Points > 0){
          msgBoard.innerText += '\n' + ` ${player.FirstName} ${player.LastName} Scores ${player.Points}`;
        }
        if(player.Fouls > 0){
          msgBoard.innerText += '\n' + ` ${player.FirstName} ${player.LastName} has ${player.Fouls} fouls`;
        }
      });
    }
  }, 500);
  // when the game time is done - check which team won and generate the message with team name, final score, and top scorrer from the team
}
function updateMsg(newMsg) {
  msgBoard.innerText = newMsg;
}
function generateTeams() {
  // run generate player 5 times for each team
  // populate each team array with 5 players each
  generateTeam(teamA, 5);
  generateTeam(teamB, 5);
}
function generateTeam(teamArray, numOfPLayers) {
  for (let i = 0; i < numOfPLayers; i++) {
    teamArray.push(generatePlayer());
  }
}
function generatePlayer() {
  // pick random first name from firstNames array
  // pick random last name from lastNames array
  // pick random height from 180-220 cm
  // start each player with 0 points and 0 fouls
  return {
    FirstName: firstNames[(Math.random() * 9).toFixed()],
    LastName: lastNames[(Math.random() * 9).toFixed()],
    PlayerHeight: (Math.random() * (220 - 180) + 180).toFixed(),
    Points: 0,
    Fouls: 0,
  };
}
function updateGameTime(newTime) {
  gameTimeNum.innerText = newTime;
}
function updateTeamScoreInUI(team, addPoints) {
    // add correct flow - if team is A - update A score, else - update B score
    if (team === 'A'){
        let teamAScoreNum = parseInt(teamAScore.innerText);
        teamAScoreNum += addPoints;
        teamAScore.innerText = teamAScoreNum;
    }else if(team === 'B'){
        let teamBScoreNum = parseInt(teamBScore.innerText);
        teamBScoreNum += addPoints;
        teamBScore.innerText = teamBScoreNum;
    }
    
}
function generateEvent(){

    let team = (Math.random() * (2 - 1 ) + 1).toFixed();

    let randomPlayer = (Math.random() * 4).toFixed();

    //0 goal, 1 foul
    let eventType =parseInt((Math.random() * 1).toFixed());

    let currentEventMessage = "";

    switch (eventType) {
        case 0:
            team = team == 1 ? 'A' : "B";
            let point =parseInt((Math.random() * (3 - 2 ) + 2).toFixed());
            updateTeamScoreInUI(team , point);
            goalAudio.pause();
            goalAudio.play();
            
            if(team==='A'){
                teamA[randomPlayer].Points += point;
                currentEventMessage ="GOAL: " + teamA[randomPlayer].FirstName +" " +teamA[randomPlayer].LastName +` scored ${point} points`
                
            } else {
                teamB[randomPlayer].Points += point;
                currentEventMessage ="GOAL: " + teamB[randomPlayer].FirstName +" " +teamB[randomPlayer].LastName +` scored ${point} points`
            }

            

            break;
        case 1:
          team = team == 1 ? 'A' : "B";
          foulAudio.pause();
          foulAudio.play();

            if(team==='A'){
                teamA[randomPlayer].Fouls ++;
                currentEventMessage ="FOUL:" + teamA[randomPlayer].FirstName +" " +teamA[randomPlayer].LastName;
            } else {
                teamB[randomPlayer].Fouls ++;
                currentEventMessage ="FOUL:" + teamB[randomPlayer].FirstName +" " +teamB[randomPlayer].LastName;
            }
            if(teamA[randomPlayer].Fouls == 6){
              teamA[randomPlayer].isSuspended = true;
            }else{
              teamB[randomPlayer].isSuspended = true;
            }
            
            break;
    
        default:
            break;
    }

    updateMsg(currentEventMessage);

    
}
