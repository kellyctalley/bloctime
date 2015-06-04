blocTime = angular.module('BlocTime', ['ui.router', 'firebase']);

//create countdown timers
  //work timer starts at 25 minutes
  //break timer starts at 5 minutes
  //filter into timecode format

blocTime.controller("countdownTimer", ['$scope', '$interval', function($scope, $interval) {

  $scope.counter = 1500;
  var stop;

  $scope.startTimer = function() {
    stop = $interval(function() {
      $scope.counter--;
    }, 1000);
  };


  $scope.stopTimer = function() {
    $interval.cancel(stop);
  }

}]);

/*blocTime.controller("counterCtrl",['$scope','$timeout', function($scope,$timeout){

 //Adding initial value for counter
$scope.counter = 2500;
var stopped;

//timeout function
//1000 milliseconds = 1 second
//Every second counts
//Cancels a task associated with the promise. As a result of this, the //promise will be resolved with a rejection.  
$scope.countdown = function() {
    stopped = $timeout(function() {
       console.log($scope.counter);
     $scope.counter--;   
     $scope.countdown();   
    }, 1000);
  };
   
    
$scope.stop = function(){
   $timeout.cancel(stopped);
    
    } 


}]); */


//create button with ngClick directive to start or reset timer
  //when button is clicked, timer should countdown every second

//timer cannot pause, only reset


blocTime.filter('timecode', function(){
  return function(seconds) {
    seconds = Number.parseFloat(seconds);

    //retuned when no time is provided.
    if (Number.isNaN(seconds)){
      return '--:--';
    }

    //make it a whole number
    var wholeSeconds = Math.floor(seconds);

    var minutes = Math.floor (wholeSeconds / 60);

    remainingSeconds = wholeSeconds % 60;

    var output = minutes + ':';

    //zero pad seconds, so 9 seconds should be :09
    if (remainingSeconds < 10) {
      output += '0';
    }

    output += remainingSeconds;

    return output;
  }
})