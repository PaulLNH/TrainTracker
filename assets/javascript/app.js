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

// Store database obj to var
var database = firebase.database();
var ref = database.ref("traintracker-2b358");

// Function to call on a timer to update train table
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
        var startTimeConverted = moment(trainStart, "HH:mm");
        var displayTime = moment(startTimeConverted).format("HH:mm");

        // Current Time
        var currentTime = moment();
        // Use this variable to change the time at the top of the chart for CURRENT TIME:
        var displayCurrent = moment(currentTime).format("HH:mm");

        // Difference between the times
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;

        // Minute Until Train
        var tMinutesTillTrain = trainFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

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

// Checks for an update every 10 seconds
var liveUpdate = setInterval(function() {
  updateTrainTable();
}, 10000);
////////// TEST CODE ////////////

// 2. Adding new train
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

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  //   console.log(newTrain.name);
  //   console.log(newTrain.destination);
  //   console.log(newTrain.start);
  //   console.log(newTrain.frequency);

  // Clears all of the text-boxes
  $("#inputName").val("");
  $("#inputDestination").val("");
  $("#inputFirst").val("");
  $("#inputFrequency").val("");
});

// 3. Create Firebase event for adding new train to the database and a row to our table
database.ref().on("child_added", function(childSnapshot) {
  // console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // Calculate the train times using moment js

  // First Time (pushed back 1 year to make sure it comes before current time)
  var startTimeConverted = moment(trainStart, "HH:mm");
  var displayTime = moment(startTimeConverted).format("HH:mm");
  // console.log("START TIME: " + displayTime);

  // Current Time
  var currentTime = moment();
  // Use this variable to change the time at the top of the chart for CURRENT TIME:
  var displayCurrent = moment(currentTime).format("HH:mm");

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
