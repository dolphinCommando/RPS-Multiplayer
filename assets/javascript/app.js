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

  database = firebase.database();

  var connectedRef = firebase.database().ref('.info/connected');
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
    var newRef = database.ref('players').push();
    newRef.set({
           'name': playerName,
           'choice': '',
           'losses': 0,
           'wins': 0 

      });
      $('#player-name').html(`<p>Welcome ${playerName}</p>`);
  });

 
    

