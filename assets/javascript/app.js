// Initialize Firebase
var config = {
  apiKey: "AIzaSyCjdSrvzFYdeaDAVqmPadJVOrSnjNOLGm4",
  authDomain: "traintracker-2b358.firebaseapp.com",
  databaseURL: "https://traintracker-2b358.firebaseio.com",
  projectId: "traintracker-2b358",
  storageBucket: "traintracker-2b358.appspot.com",
  messagingSenderId: "666867210918"
};
firebase.initializeApp(config);

// Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// Login with Google
// ui.start("#firebaseui-auth-container", {
//   signInOptions: [
//     // List of OAuth providers supported.
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID
//   ]
// Other config options...
// });

// var uiConfig = {
//   callbacks: {
//     signInSuccessWithAuthResult: function(authResult, redirectUrl) {
// User successfully signed in.
// Return type determines whether we continue the redirect automatically
// or whether we leave that to developer to handle.
//   return true;
// },
// uiShown: function() {
// The widget is rendered.
// Hide the loader.
//   document.getElementById("loader").style.display = "none";
//     }
//   },
// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//   signInFlow: "popup",
//   signInSuccessUrl: "https://paullnh.github.io/TrainTracker/index.html",
//   signInOptions: [
// Leave the lines as is for the providers you want to offer your users.
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID
//   ],
// Terms of service url.
//   tosUrl: "https://paullnh.github.io/TrainTracker/index.html"
// };

// The start method will wait until the DOM is loaded.
// ui.start("#firebaseui-auth-container", uiConfig);
////// OAuth goes above here //////

// Store database obj to var
var database = firebase.database();
var update = false;
var updateBtn = $("#updateBtn");

// Function to update train table
function updateTrainTable() {
  // Clears the table
  $("#trainTable").html("");
  // Calls the info from the database, passes the snapshot
  database.ref().once("value", function(snapshot) {
    // If there is a snapshot run code
    if (snapshot.exists()) {
      // Iterate through each snapshot
      snapshot.forEach(function(data) {
        // Store everything into a variable.
        var trainName = data.val().name;
        var trainDestination = data.val().destination;
        var trainStart = data.val().start;
        var trainFrequency = data.val().frequency;

        // Calculate the train times using moment js

        // First Time (pushed back 1 year to make sure it comes before current time)
        var startTimeConverted = moment(trainStart, "HH:mm").subtract(
          1,
          "years"
        );
        var displayTime = moment(startTimeConverted).format("HH:mm");

        // Current Time
        var currentTime = moment();

        // Displays current time in a format that is good for humans to read
        var displayCurrent = moment(currentTime).format("HH:mm:ss A");

        // Difference between the times
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;

        // Minute Until next Train
        var tMinutesTillTrain = trainFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        // Displays the arrival time in a format that is good for humans to read
        var displayArrival = moment(nextTrain).format("HH:mm");

        $("#currentTime").text(displayCurrent);
        // Add each train's data into the table
        $("#trainTable").append(
          "<tr><td>" +
            trainName +
            "</td><td>" +
            trainDestination +
            "</td><td>" +
            displayTime +
            "</td><td>" +
            trainFrequency +
            " min</td><td>" +
            displayArrival +
            "</td><td>" +
            tMinutesTillTrain +
            " min </td></tr>"
        );
      });
    }
  });
}

// Function to update the live data table
function updateBtn() {
  update = true;
  // Clears the table
  $("#trainTable").html("");
  // Calls the info from the database, passes the snapshot
  database.ref().once("value", function(snapshot) {
    // If there is a snapshot run code
    if (snapshot.exists()) {
      // Iterate through each snapshot
      snapshot.forEach(function(data) {
        // Store everything into a variable.
        var trainName = JSON.stringify(data.val().name);
        var trainDestination = JSON.stringify(data.val().destination);
        var trainStart = JSON.stringify(data.val().start);
        var trainFrequency = JSON.stringify(data.val().frequency);

        // Calculate the train times using moment js

        // First Time (pushed back 1 year to make sure it comes before current time)
        var startTimeConverted = moment(trainStart, "HH:mm").subtract(
          1,
          "years"
        );
        var displayTime = moment(startTimeConverted).format("HH:mm");

        // Current Time
        var currentTime = moment();

        // Displays current time in a format that is good for humans to read
        var displayCurrent = moment(currentTime).format("HH:mm:ss A");

        // Difference between the times
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;

        // Minute Until next Train
        var tMinutesTillTrain = trainFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        // Displays the arrival time in a format that is good for humans to read
        var displayArrival = moment(nextTrain).format("HH:mm");

        $("#currentTime").text(displayCurrent);
        // re-render train data in text box
        $("#trainTable").append(
          '<tr><td><input type="text" id=' +
            trainName +
            ' class="form-control" value=' +
            trainName +
            '></td><<td><input type="text" id=' +
            trainDestination +
            ' class="form-control" value=' +
            trainDestination +
            '></td><td><input type="text" id=' +
            displayTime +
            ' class="form-control" value=' +
            displayTime +
            '></td><td><input type="text" id=' +
            trainFrequency +
            ' class="form-control" value=' +
            trainFrequency +
            "></td><td>" +
            displayArrival +
            "</td><td>" +
            tMinutesTillTrain +
            " min </td></tr>"
        );
      });
    }
  });
  // <input type="text" id="inputName" class="form-control" placeholder="Train Name">
  // Logic to update train
}

// Function to remove a train
function removeBtn() {
  // Logic to update train
}

// Button to edit the live data table
updateBtn.on("click", function(event) {
  event.preventDefault();
  if (!update) {
    updateBtn.text("Save Changes");
    updateBtn();
    update = true;
  } else {
    ///////// THIS NEEDS TO GO IN THE UPDATEBTN FUNCTION SOMEHOW BUT SAVE WHEN CLICKED /////////
    // Once the text boxes are rendered gather input:

    // Grabs user input
    var trainName = $("#inputName")
      .val()
      .trim();
    var trainDestination = $("#inputDestination")
      .val()
      .trim();
    var trainStart = moment(
      $("#inputFirst")
        .val()
        .trim(),
      "HHmm"
    ).format("HHmm");
    var trainFrequency = $("#inputFrequency")
      .val()
      .trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      start: trainStart,
      frequency: trainFrequency
    };

    // Uploads train info to the database
    database.ref().push(newTrain);
    updateBtn.text("Edit Train");
    update = false;
    ///////// THIS NEEDS TO GO IN THE UPDATEBTN FUNCTION SOMEHOW BUT SAVE WHEN CLICKED /////////
  }
});

// Button to remove train
$("#removeBtn").on("click", function(event) {
  event.preventDefault();
  removeBtn();
});

// Checks for an update every second
var liveUpdate = setInterval(function() {
  if (!update) {
    updateTrainTable();
  }
}, 1000);

// Adds new train via the form
$("#submitBtn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#inputName")
    .val()
    .trim();
  var trainDestination = $("#inputDestination")
    .val()
    .trim();
  var trainStart = moment(
    $("#inputFirst")
      .val()
      .trim(),
    "HHmm"
  ).format("HHmm");
  var trainFrequency = $("#inputFrequency")
    .val()
    .trim();

  if (
    $("#inputName").val("") ||
    $("#inputDestination").val("") ||
    $("#inputFirst").val("") ||
    $("#inputFrequency").val("")
  ) {
    $("#warningText")
      .text("You did not input all the necessary fields")
      .css("color", "red");
    setTimeout(function() {
      $("#warningText")
        .text("")
        .css("color", "black");
    }, 3000);
  } else {
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      start: trainStart,
      frequency: trainFrequency
    };

    // Uploads train info to the database
    database.ref().push(newTrain);

    // Clears all of the input fields
    $("#inputName").val("");
    $("#inputDestination").val("");
    $("#inputFirst").val("");
    $("#inputFrequency").val("");
  }
});

// Event listner in firebase when new train is added to the database
database.ref().on("child_added", function(childSnapshot) {
  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // Calculate the train times using moment js

  // First Time (pushed back 1 year to make sure it comes before current time)
  var startTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
  var displayTime = moment(startTimeConverted).format("HH:mm");
  // console.log("START TIME: " + displayTime);

  // Current Time
  var currentTime = moment();
  // Use this variable to change the time at the top of the chart for CURRENT TIME:
  var displayCurrent = moment(currentTime).format("HH:mm:ss A");

  // Difference between the times
  var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  // console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  var displayArrival = moment(nextTrain).format("HH:mm");

  $("#currentTime").text(displayCurrent);
  // Add each train's data into the table
  $("#trainTable").append(
    "<tr><td>" +
      trainName +
      "</td><td>" +
      trainDestination +
      "</td><td>" +
      displayTime +
      "</td><td>" +
      trainFrequency +
      " min</td><td>" +
      displayArrival +
      "</td><td>" +
      tMinutesTillTrain +
      " min </td></tr>"
  );
});
