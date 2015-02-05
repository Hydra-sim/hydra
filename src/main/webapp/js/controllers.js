(function() {

    'use strict';

    var app = angular.module('controllers', [
        'ngRoute',
        'services'
    ]);

    app.controller('ApplicationController', ['$scope', '$location', 'Simulation', 'SimResult', function ($scope, $location, Simulation, SimResult) {
        $scope.timeBetweenBuses = 10;
        $scope.numberOfEntrances = 1;
        $scope.days = 0;
        $scope.hours = 1;
        $scope.minutes = 0;

        $scope.runSim = function(timeBetweenBuses, numberOfEntrances, days, hours, minutes) {
            var sim = new Simulation({
                'timeBetweenBuses': timeBetweenBuses,
                'numberOfEntrances': numberOfEntrances,
                'days': days,
                'hours': hours,
                'minutes': minutes
            });

            sim.$save().then(function(result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
            });
        };
    }]);

    app.controller('SimulationResult', ['$scope', 'SimResult', function($scope, SimResult) {
        $scope.entitiesConsumed         = SimResult.data.entitiesConsumed;
        $scope.entitiesInQueue          = SimResult.data.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = SimResult.data.maxWaitingTimeInTicks;
    }]);

})();