$(document).on("ready", function(){
    var userID = localStorage.getItem('ID');
    var weekNum = moment(new Date().toJSON().slice(0,10)).week();
    console.log(weekNum)

    $('#summaryModal').on("click", function(){
        //Weekly Goals Chart
        var goalQuery = new Firebase('https://fb-calorie-tracker.firebaseio.com/users/'+ userID + '/goals/');
        goalQuery.on('value', function(snapshot){

            var grains = snapshot.val().goalGrain;
            var meat = snapshot.val().goalMeat;
            var fruit = snapshot.val().goalFruit;
            var veg = snapshot.val().goalVeg;
            var dairy = snapshot.val().goalDairy;
            var other = snapshot.val().goalSweets;
            var calories = snapshot.val().goalWeeklyCal;
            var goalsData = {
                labels: [
                    "Grains",
                    "Meats",
                    "Fruit",
                    "Vegetables",
                    "Dairy",
                    "Other"
                ],
                datasets: [
                    {
                        data: [grains, meat, fruit, veg, dairy, other],
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#00cc00",
                            "#FF7700",
                            "#CC00CC"
                        ],
                        hoverBackgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#00cc00",
                            "#FF7700",
                            "#CC00CC"
                        ]
                    }]
            };
            $('#goalSummary').html('<h1>Goals</h1><canvas class="chart" id="goalChart" width="150" height="150"></canvas><p><strong>Calories: ' + calories);
            var goalsTarget = document.getElementById("goalChart");
            var goalsChart = new Chart(goalsTarget, {
                type: 'pie',
                data: goalsData
            })
        });

        //Weekly Summary Chart
        var mealQuery = new Firebase('https://fb-calorie-tracker.firebaseio.com/users/' + userID +'/meals/');
        var totalCal = [];
        var totalGrains = [];
        var totalOther = [];
        var totalVeg = [];
        var totalMeats = [];
        var totalFruit = [];
        var totalDairy = [];
        //get all items posted in the past week
        mealQuery.orderByChild("week").equalTo(weekNum).on("child_added", function(snapshot){
            //get the sum of calories for the week thus far
            totalCal.push(snapshot.val().calories);
            if(snapshot.val().foodGroup == 'Grains'){
                totalGrains.push(snapshot.val().foodGroup);
            }else if(snapshot.val().foodGroup == 'Other foods (fats,oils,sweets)'){
                totalOther.push(snapshot.val().foodGroup);
            }else if(snapshot.val().foodGroup == 'Vegetables'){
                totalVeg.push(snapshot.val().foodGroup);
            }else if(snapshot.val().foodGroup == 'Meats'){
                totalMeats.push(snapshot.val().foodGroup );
            }else if(snapshot.val().foodGroup == 'Fruits'){
                totalFruit.push('snapshot.val().foodGroup ');
            }else if(snapshot.val().foodGroup == 'Milk Products'){
                totalDairy.push(snapshot.val().foodGroup);
            }
            //data values for chart
            //using arrow function to save space
            var sumOfCal = totalCal.reduce( (prev, curr) => prev + curr );
            var sumGrains = totalGrains.length;
            var sumVeg = totalVeg.length;
            var sumFruit = totalFruit.length;
            var sumDairy = totalDairy.length;
            var sumMeats = totalMeats.length;
            var sumOther = totalOther.length;
            var summaryData = {
                labels: [
                    "Grains",
                    "Meats",
                    "Fruit",
                    "Vegetables",
                    "Dairy",
                    "Other"
                ],
                datasets: [
                    {
                        data: [sumGrains, sumMeats, sumFruit, sumVeg, sumDairy, sumOther],
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#00cc00",
                            "#FF7700",
                            "#CC00CC"
                        ],
                        hoverBackgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#00cc00",
                            "#FF7700",
                            "#CC00CC"
                        ]
                    }]
            };

            $('#totalSummary').html('<h1>Summary</h1><canvas class="chart" id="totalChart" width="150" height="150"></canvas><p><strong>Calories: ' + sumOfCal);
            var summaryTarget = document.getElementById("totalChart");
            var summaryChart = new Chart(summaryTarget, {
                type: 'pie',
                data: summaryData
            })
        });
    });
});
