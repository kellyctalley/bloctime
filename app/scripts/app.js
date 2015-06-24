blocTime = angular.module('BlocTime', ['ui.router', 'firebase']);

//create countdown timers
  //work timer starts at 25 minutes
  //break timer starts at 5 minutes
  //filter into timecode format

  //create variables for full time, short break time and long break time
  //can these be done as variables and then inserted into $scope.counter?
  //and then keep track of how many sessions have gone by?
  //possibly add some kind of indicator?

var workTimer = 10; //1500
var shortBreak = 3; //300
var longBreak = 5; //1800

var timerDing = new buzz.sound( "https://dl.dropboxusercontent.com/u/101665267/elevator-ding.mp3", {
  preload: true
});

blocTime.controller("countdownTimer", ['$scope', '$interval', function($scope, $interval) {
  $scope.isTimerRunning = false;
  $scope.breakTime = false;
  var pomodoros = 0;
  var pomodorGo;


  $scope.startTimer = function() {
    $scope.isTimerRunning = true;

    if (!$scope.counter) {
      $scope.counter = workTimer;
    }

    pomodorGo = $interval(function() {
      $scope.counter--;
      console.log("interval");
      if ($scope.counter == 0) {
        $interval.cancel(pomodorGo);
        timerDing.play();
        $scope.isTimerRunning = false;

        if (!$scope.breakTime) {
          pomodoros++;
          console.log(pomodoros);
          $scope.breakTime = true;

          if (pomodoros % 4 === 0) {
            $scope.counter = longBreak;
            $scope.isTimerRunning = false;
          } else {
            $scope.counter = shortBreak;
            $scope.isTimerRunning = false;
          }
        } else {
          console.log("back to work");
          $scope.breakTime = false;
          $scope.counter = workTimer;
        }

      }

    }, 1000);



    /*this.isTimerRunning = true;
    pomodorGo = $interval(function() {
      $scope.counter--;
      if ($scope.counter == 0) {
        $interval.cancel(pomodorGo);
        $scope.counter = 1500;
      }
    }, 1000);*/

  };

  $scope.resetTimer = function() {
    $interval.cancel(pomodorGo);
    $scope.counter = workTimer;
    $scope.isTimerRunning = false;
  };

  /*$scope.$watch('counter', function() {
    console.log("watch");
    if ($scope.counter===0) {
      //timerDing.play();
      console.log("ding");
    }
  });*/

}]);


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