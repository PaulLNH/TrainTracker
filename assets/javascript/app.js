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
var update = false;
var updateBtn = $("#updateBtn");
var getKey = "";
var editName, editDestination, editFrequency, editStart;

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
        // var trainId = data.key();

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
          '<tr class="hover updateBtn" id="' +
            data.key +
            '"><td>' +
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
            ' min </td> <td><i class="fas fa-times-circle removeBtn" data-toggle="tooltip" data-placement="right" title="Remove Train"></i></td></tr>'
        );
      });
    }
  });
}

// Enable tooltip for remove button
$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
});

// Remove line button
$("body").on("click", ".removeBtn", function() {
  getKey = $(this)
    .parent()
    .parent()
    .attr("id");
  database.ref(getKey).remove();
  $(this)
    .closest("tr")
    .remove();
});

// Update Form
$("body").on("click", ".updateBtn", function() {
  getKey = $(this).attr("id");
  console.log(getKey);
  database.ref(getKey).once("value", function(snapshot) {
    console.log(JSON.stringify(snapshot));
    editName = snapshot.val().name;
    console.log(JSON.stringify(editName));
    editDestination = snapshot.val().destination;
    console.log(editDestination);
    editStart = snapshot.val().start;
    console.log(editStart);
    editFrequency = snapshot.val().frequency;
    console.log(editFrequency);
    $("#editName").attr("value", editName);
    $("#editDestination").attr("value", editDestination);
    $("#editStart").attr("value", editStart);
    $("#editFrequency").attr("value", editFrequency);
  });
  // Display modal, disable escape key and disable clicking off the modal
  $("#trainModal").modal({
    show: true,
    backdrop: "static",
    keyboard: false
  });
});

// Update Button
$("body").on("click", "#editSave", function() {
  // Grab field inputs
  var newName = $("#editName")
    .val()
    .trim();
  var newDestination = $("#editDestination")
    .val()
    .trim();
  var newStart = $("#editStart")
    .val()
    .trim();
  var newFrequency = $("#editFrequency")
    .val()
    .trim();
  // Form Validation
  if (!newName || !newDestination || !newStart || !newFrequency) {
    $("#editWarning")
      .text("You did not input all the necessary fields")
      .css("color", "red");
    setTimeout(function() {
      $("#editWarning")
        .text("")
        .css("color", "black");
    }, 3000);
  } else {
    var updates = {
      name: newName,
      destination: newDestination,
      start: newStart,
      frequency: newFrequency
    };

    // Update database
    database.ref(getKey).update(updates);

    // Hide modal
    $("#trainModal").modal({
      show: false
    });
  }
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

  if (!trainName || !trainDestination || !trainStart || !trainFrequency) {
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
  console.log(childSnapshot.key);
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
    '<tr class="hover updateBtn" id="' +
      childSnapshot.key +
      '"><td>' +
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
      ' min </td> <td><i class="fas fa-times-circle removeBtn" data-toggle="tooltip" data-placement="right" title="Remove Train"></i></td></tr>'
  );
});
