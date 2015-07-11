blocTime = angular.module('BlocTime', ['ui.router', 'firebase']);

var workTimer = 10; //1500
var shortBreak = 3; //300
var longBreak = 5; //1800

var timerDing = new buzz.sound( "https://dl.dropboxusercontent.com/u/101665267/elevator-ding.mp3", {
  preload: true
});

blocTime.controller("countdownTimer", ['$scope', '$interval', 'Tasks', function($scope, $interval, Tasks) {
  $scope.isTimerRunning = false;
  $scope.breakTime = false;
  $scope.pomoNumber = 1;
  var pomodoros = 0;
  var pomodorGo;

  // might need to tweak this
  $scope.tasks = Tasks.all;

  $scope.addTask = function () {
    Tasks.all.$add({
      task: $scope.task,
      completed: Date.now()
    });

    $scope.task = null;

  };

  $scope.checkPress = function (event) {
    //event.which
  };

  $scope.clearData = function () {
    Tasks.clearData();
  };

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
          $scope.pomoNumber ++;
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

  $scope.pauseTimer = function() {
    $interval.cancel(pomodorGo);
    $scope.isTimerRunning = false;
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

blocTime.filter('timecode', function(){
  return function(seconds) {
    seconds = Number.parseFloat(seconds);

    //retuned when no time is provided.
    if (Number.isNaN(seconds)){
      return '00:00';
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
});

blocTime.factory('Tasks', ['$firebaseArray', function($firebaseArray) {
  var ref = new Firebase("https://radiant-heat-6289.firebaseio.com");

  // create an AngularFire reference to the data
  var tasks = $firebaseArray(ref);

  function clearData() {
    ref.remove();
  };

  return {
    all: tasks,
    clearData: clearData
    // remaining logic for tasks
  };

}]);




//pie timer
  //draw circle
  //set circle equal to timer
  //fill in circle as timer runs
  //fill pauses when pause button is clicked
  //fill resets when reset button is clicked

var seconds = 30;
var doPlay = true;
var loader = document.getElementById('loader')
  , α = 0
  , π = Math.PI
  , t = (seconds/360 * 1000);

(function draw() {
  α++;
  α %= 360;
  var r = ( α * π / 180 )
    , x = Math.sin( r ) * 125
    , y = Math.cos( r ) * - 125
    , mid = ( α > 180 ) ? 1 : 0
    , anim = 'M 0 0 v -125 A 125 125 1 ' 
           + mid + ' 1 ' 
           +  x  + ' ' 
           +  y  + ' z';
  //[x,y].forEach(function( d ){
  //  d = Math.round( d * 1e3 ) / 1e3;
  //});
 
  loader.setAttribute( 'd', anim );
  
  if(doPlay){
    setTimeout(draw, t); // Redraw
  }
})();