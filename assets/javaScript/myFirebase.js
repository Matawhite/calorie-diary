var myFireBase = new Firebase('https://fb-calorie-tracker.firebaseio.com/');
//create user node
var userRef = myFireBase.child("users");

var userID = localStorage.getItem('ID');

//check if there is a useID, if not create one and send to database
if(userID ===  null){
	//creates a ramdon userID
	userID = Math.random().toString(36).substring(7);
	localStorage.setItem('ID', userID);
	userID = localStorage.getItem('ID');
 	userRef.push({
	userID: userID
		})
 }

var myFireBase = new Firebase('https://fb-calorie-tracker.firebaseio.com/');
//create user node
var userRef = myFireBase.child("users");

//create users/userID/meals node
var mealRef = myFireBase.child("users/" + userID + "/meals");
var mealQuery = new Firebase('https://fb-calorie-tracker.firebaseio.com/users/' + userID +'/meals/');

//create users/userID/goals node
var goalRef = myFireBase.child("users/" + userID + "/goals");
var goalQuery = new Firebase('https://fb-calorie-tracker.firebaseio.com/users/'+ userID + '/goals/');

var weekNum = moment(new Date().toJSON().slice(0,10)).week();



// get data from form
$("#myForm").submit(function(){
	var start = document.getElementById('startDate').value;
	var calories = document.getElementById('calories').value;
	var calories = parseInt(calories)
	var description = document.getElementById('description').value;
	var foodGroup = document.getElementById('foodGroup').value;
	var weekday = moment(start, "MMMM Do, YYYY").week();
	//weird bug when moment JS converts the date is off my one week
	var weekday = weekday - 1;

	mealRef.push({
       user: userID,
       startDate: start,
       calories: calories,
       description: description,
	   foodGroup: foodGroup,
	   week: weekday
   })

})

//setting calorie goals
$("#submitGoals").on('click',function(){
	var goalWeeklyCal = document.getElementById('mWeeklyCalories').value;
	var goalMeat = document.getElementById('mMeats').value;
	var goalGrain = document.getElementById('mGrains').value;
	var goalDairy = document.getElementById('mMilkProds').value;
	var goalSweets = document.getElementById('mOtherFoods').value;
	var goalVeg = document.getElementById('mVegetables').value;
	var goalFruit = document.getElementById('mFruits').value;
	goalRef.update({
			goalVeg: goalVeg,
			userID: userID,
			goalWeeklyCal: goalWeeklyCal,
			goalMeat: goalMeat,
			goalGrain: goalGrain,
			goalDairy: goalDairy,
			goalSweets: goalSweets,
			goalFruit: goalFruit
	})
	$('#successMessage').text('Your goals have been updated!');
})

//display meal items on the page. Query then append DOM
mealQuery.orderByChild("startDate").limitToLast(50).on('child_added', function(snapshot){
	var displayCalories = snapshot.val().calories;
	var displayStart = snapshot.val().startDate;
	var displayDescription = snapshot.val().description;
	var displayFoodGroup = snapshot.val().foodGroup;

	var updateTable = "<tr><td>" + displayCalories+ "</td><td>" +
  displayDescription + "</td><td>" + displayFoodGroup +
  "</td><td>" + displayStart +  "</td></tr>"

	$("#table").append(updateTable);
		},function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
});
