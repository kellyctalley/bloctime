(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

blocTime.controller("countdownTimer", ['$scope', '$interval', 'Tasks', function($scope, $interval, Tasks) {
  $scope.isTimerRunning = false;
  $scope.breakTime = false;
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

  return {
    all: tasks
    // remaining logic for tasks
  }

  $scope.clearData = function() {
    ref.remove();
  };

}]);
},{}]},{},[1]);