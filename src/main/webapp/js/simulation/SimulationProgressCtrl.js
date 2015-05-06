(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationProgressCtrl', function($scope, $log, $interval) {

        $scope.steps = 1;
        $scope.progress = {};
        $scope.progress.position = 0;

        var intervalPromise;

        $scope.forward = function() {

            $interval.cancel(intervalPromise);
            $scope.changeTime(1);
        };

        $scope.backward = function() {

            $interval.cancel(intervalPromise);
            $scope.changeTime(-1);
        };

        $scope.pause = function() {

            $interval.cancel(intervalPromise);
        };

        $scope.changeTime = function(value) {

            intervalPromise = $interval(function () {

                if($scope.progress.position >= 0 && $scope.progress.position <= 100) $scope.progress.position += value;
                $log.info($scope.progress.position);

            }, 100); // Milliseconds, iterations
        }
    });

})();