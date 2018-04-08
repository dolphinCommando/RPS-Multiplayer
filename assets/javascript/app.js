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

  

  const database = firebase.database();

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
    var index = ''
    var newRef = database.ref('players').child(`${playerName}`);
    newRef.set({
           'losses': 0,
           'wins': 0 

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
  });

  database.ref('players').on('value', function(snapshot) {
    console.log('Players value ' + JSON.stringify(snapshot.val()));
    console.log(snapshot.val());
  });

  

  