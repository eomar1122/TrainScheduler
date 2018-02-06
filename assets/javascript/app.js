 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCCZQ9WRGyPyjy2lmQPzwOHSvwgnoumu_k",
    authDomain: "train-scheduler-5a2bd.firebaseapp.com",
    databaseURL: "https://train-scheduler-5a2bd.firebaseio.com",
    storageBucket: "train-scheduler-5a2bd.appspot.com"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // On click event for submit button for adding train

  $("#submit-btn").on("click", function(event) {

  		event.preventDefault();

  		// Grap user inputs
  		var trainName = $("#train-name-input").val().trim();
  		var destination = $("#destination-input").val().trim();
  		var firstTrain = $("#first-train-input").val().trim();
  		var frequency = $("#frequency-input").val().trim();

  		// Call validation functions
  		var validateMilitaryTimeInput = militaryTimeValidate(firstTrain);
  		var validateFrequencyInput = numValidate(frequency);

  		// Creates local "temporary" object for holding employee data
  		var newTrain = {
  			name: trainName,
  			destination: destination,
  			firstTrain: firstTrain,
  			frequency: frequency
  		};

  		// Check if the input time and frequency are numbers or not
  		if (validateMilitaryTimeInput && validateFrequencyInput) { 

  			// Upload train input data to the firebase database
  			database.ref().push(newTrain);

  			// Logs everything to console
	  		console.log(newTrain.name);
	  		console.log(newTrain.destination);
	  		console.log(newTrain.firstTrain);
	  		console.log(newTrain.frequency);

	  		// Alert
	 		alert("Train successfully added");

	  		// Clears all of the text-boxes
	  		$("#train-name-input").val('');
	  		$("#destination-input").val('');
	  		$("#first-train-input").val('');
	  		$("#frequency-input").val('');
  		} else {
  			alert(frequency + " is not a number. Please enter numbers from [0-9]");
  		}


  });

  // Create Firebase event for adding trains to the database and a row in the html when a user adds an entry

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  	console.log(childSnapshot.val());

  	// Calculate time using Moment
  	 // Assumptions
    var tFrequency = childSnapshot.val().frequency;;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
    var trainTime = moment(firstTimeConverted).format('HH:mm');
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");

  	// Store everything into a variable
  	var trainName = childSnapshot.val().name;
  	var destination = childSnapshot.val().destination;
  	var frequency = childSnapshot.val().frequency;

  	// Train Info
  	console.log(trainName);
  	console.log(destination);
  	console.log(trainTime);
  	console.log(frequency);


  	// Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");

  });


 	// Function to check the Military time format
	function militaryTimeValidate(strValue) {
  		var objRegExp = /^([01]\d|2[0-3]):?([0-5]\d)$/;
  	// console.log("objRegExp "+ objRegExp.test(strValue));
  		return objRegExp.test(strValue);
	}

  // Function to check if the inputs are numbers 
	function numValidate(strValue) {
  		var objRegExp = /^\d+$/;
  // console.log("objRegExp "+ objRegExp.test(strValue));
  		return objRegExp.test(strValue);
	}

  // Refreash the train schedule every 1 minute
	setInterval(function(){
    	location.reload();
  	}, 60000)






