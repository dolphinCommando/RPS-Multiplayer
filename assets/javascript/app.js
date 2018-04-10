// Initialize Firebase
  var config = {
    apiKey: "AIzaSyClHmL8O28isW_xz1f5yaUgmURcdKhW-7I",
    authDomain: "multi-rps-5c6a8.firebaseapp.com",
    databaseURL: "https://multi-rps-5c6a8.firebaseio.com",
    projectId: "multi-rps-5c6a8",
    storageBucket: "",
    messagingSenderId: "362312322057"
  };
  firebase.initializeApp(config);

  var index=0;
  var playerIndex = index;

  var turns = -1;

  var gamelogic = {
    'rock': {'rock-paper': 'loses', 'rock-scissors': 'wins'},
    'paper': {'paper-scissors': 'loses', 'paper-rock': 'wins'},
    'scissors': {'scissors-rock': 'loses', 'scissors-paper': 'wins'}
  };

  const database = firebase.database();

  database.ref().child('index').set({'value': index});
  database.ref().child('turns').set({'value': turns});
  
  var ref1 = database.ref('players/0');
  var ref2 = database.ref('players/1');
  const connectedRef = firebase.database().ref('.info/connected');
  connectedRef.on('value', function(snap) {
    if (snap.val() === true) {
      console.log('Connected');
      //console.log(snap.val());
      if(index===1) {
        ref1.onDisconnect().remove();
      } 
      else if(index===0) {
        ref2.onDisconnect().remove();
      } else {console.log('Index out of bounds');}
        
    } else {
      console.log('Disconnected');
      //console.log(snap.val());     
    }
  });

  $('#player-submit').click(function(event) {
    event.preventDefault();
    var playerName = $('#player-get').val();
    var newRef = database.ref().child(`players/${index}`);
    newRef.set({
           'name': playerName,
           'losses': 0,
           'wins': 0,
           'choice': '',
           'playerindex': playerIndex

      });
      $('#player-container').html(`<p>Welcome <span id="player-name">${playerName}</span></p>`);
  });
  
  $('#chat-submit').click(function(event) {
    event.preventDefault();
    var name = $('#player-name').text();
    var chatIn = $('#chat-input').val();
    var newRef = database.ref('chat').push();
    newRef.set({
      name: `${name}`,
      text: `${chatIn}`
    });
    $('chat-input').val('');
  });

  database.ref('chat').on('child_added', function(snapshot) {
    $('#chat-output').append(`${snapshot.val().name}: ${snapshot.val().text}<br>`);

  });



  database.ref('players').on('child_added', function(snapshot) {
    //console.log('Child added ' + JSON.stringify(snapshot.val()));
    if((index+1)===2) {
      database.ref('turns').update({
        'value': 0
      });
    }
    database.ref('index').update({
      'value': (index + 1)%2
    });

    var playerBoard = getPlayerByIndex(snapshot.val().playerindex);
    if (!playerBoard.includes('Error')) {
      $(playerBoard).html(`
      <h2>${snapshot.val().name}</h2>
      <p>Wins: ${snapshot.val().wins}  Losses: ${snapshot.val().losses}</p>
      <div class="options"></div>
    `)
    } else console.log(playerBoard);
    
  });

  database.ref('index').on('value', function(snapshot) {
    index = snapshot.val().value;  
    playerIndex = index;
  });
  

  $('body').on('click', '.choice', function(event) {
    event.preventDefault();
    var choice = $(this).text();
    var idx = $(this).attr('data-index');
    var ref = database.ref(`players/${idx}`);
    ref.update({
      'choice': choice
      });
    database.ref('turns').update({
      'value': turns+1
    });
    
   });

    database.ref('players').on('child_removed', function(snap) {
      $('#chat-output').append(`<p>${snap.val().name} has disconnected.`);
      index = (index - 1)%2;
    });

    database.ref().on('value', function(snap) {
      turns = snap.val().turns.value;
      if(turns!==-1) {
        var p1 = snap.val().players[0];
        var p2 = snap.val().players[1];
      }
      
      console.log(turns);
      if (turns===0) {
        renderBoard(0, '');  
      }
      else if(turns==1) {
        renderBoard(1, '');
        renderBoard(0, p1.choice)
      } else if(turns===2) {
        renderBoard(1, p2.choice);
        var choice1 = p1.choice;
        var choice2 = p2.choice;
        var result = gamelogic[choice1.toLowerCase()][`${choice1.toLowerCase()}-${choice2.toLowerCase()}`];
        if(result==='wins') {
          $('#game-results').html('Player 1 wins!');
          database.ref('players/0').update({
            'wins': p1.wins++  
          });
          database.ref('players/1').update({
            'losses': p2.losses++
          });
        } else if(result==='loses') {
          $('#game-results').html('Player 2 wins!');
          database.ref('players/0').update({
            'wins': p2.wins++
          });
          database.ref('players/1').update({
            'losses': p1.losses++
          });
        } else {console.log('Could not determine game results.');}

        setTimeout(function() {
          database.ref('turns').update({
            'value': 0
          });
        }, 5*1000);
      }  
    
    });

    function renderBoard(idx, choice) {
      var player = getPlayerByIndex(idx);
      if (!player.includes('Error')) {
        if (choice==='Rock' || choice==='Paper' || choice==='Scissors') {
          $(`${player} .options`).html(`<p>You chose: </p><h3>${choice}</h3>`);
        }
        else {
          $(`${player} .options `).html(`
            <p class="choice" data-index="${idx}">Rock</p>
            <p class="choice" data-index="${idx}">Paper</p>
            <p class="choice" data-index="${idx}">Scissors</p>
          `);
          //$(player).style('border-color', 'red');
        }
      } else console.log(player);

    }

    function getPlayerByIndex(idx) {
      if (idx === 0) {
        return '#game-player1';
      } 
      else if (idx === 1) {
        return '#game-player2';
      } else {return 'Error: index out of bounds ' + idx}
      
    }


    
   


  

  

  