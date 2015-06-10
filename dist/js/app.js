(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
blocTime = angular.module('BlocTime', ['ui.router', 'firebase']);

//create countdown timers
  //work timer starts at 25 minutes
  //break timer starts at 5 minutes
  //filter into timecode format

blocTime.controller("countdownTimer", ['$scope', '$interval', function($scope, $interval) {

  $scope.counter = 1500;
  var stop;
  var isTimerRunning = false;

  $scope.startTimer = function() {
    this.isTimerRunning = true;
    stop = $interval(function() {
      $scope.counter--;
      if ($scope.counter == 0) {
        $interval.cancel(stop);
        $scope.counter = 1500;
      }
    }, 1000);

  };

  $scope.stopTimer = function() {
    $interval.cancel(stop);
    $scope.counter = 1500;
    this.isTimerRunning = false;
  }

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
},{}]},{},[1]);