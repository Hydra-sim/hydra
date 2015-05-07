(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationAnimationCtrl', function($routeParams, menu_field_button, $scope, $interval, Simulation) {
        this.simulationId = $routeParams.id;
        menu_field_button.reset();

        $scope.datasource = {};

        Simulation.run({}, {id: $routeParams.id}, function(result) {
            $scope.datasource.nodes = result.nodes;
            $scope.datasource.edges = result.relationships;
        });

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
                console.log($scope.progress.position);

            }, 100); // Milliseconds, iterations
        }
    });

})();