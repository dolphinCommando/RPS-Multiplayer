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

  const database = firebase.database();

  database.ref().child('index').set({'value': index});

  const connectedRef = firebase.database().ref('.info/connected');
  connectedRef.on('value', function(snap) {
    if (snap.val() === true) {
      console.log('Connected');
      console.log(snap.val());
    } else {
      console.log('Disconnected');
      console.log(snap.val());    
    }
  });

  $('#player-submit').click(function(event) {
    event.preventDefault();
    var playerName = $('#player-get').val();
    var newRef = database.ref().child('players').push();
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
    console.log('Child added ' + JSON.stringify(snapshot.val()));
    database.ref('index').set({
      'value': (index + 1)%2
    });
    renderBoard(snapshot.child('playerindex').val(), snapshot.child('name').val(), snapshot.child('wins').val(), snapshot.child('losses').val(), snapshot.child('choice').val());
    
  });

  database.ref('players').on('value', function(snapshot) {
    console.log('Players value ' + JSON.stringify(snapshot.val()));
    console.log('Snapshot val' + JSON.stringify(snapshot.val()));
    //console.log('Snapshot index key '+ snapshot.child('index').val());
    
  });

  database.ref('index').on('value', function(snapshot) {
    index = snapshot.val().value;  
    playerIndex = index;
  })


  function renderBoard(idx, name, wins, losses, choice) {
    var playerBoard;
    if (idx === 0) {
      playerBoard = $('#game-player1');
    } 
    else if (idx === 1) {
      playerBoard = $('#game-player2');
    } else {console.log('Error: index out of bounds ' + idx);}

    playerBoard.html(`
      <p data-name="${name}">${name}</p>
      <p class="choice">Rock</p>
      <p class="choice">Paper</p>
      <p class="choice">Scissors</p>
      <p>Wins: ${wins}  Losses: ${losses}</p>
    `)
  }

  

  

  