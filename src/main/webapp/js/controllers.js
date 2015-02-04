(function() {

    'use strict';

    var app = angular.module('controllers', [
        'ngRoute',
        'services'
    ]);

    app.controller('ApplicationController', ['$scope', 'Simulation', function ($scope, Simulation) {
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
                console.log("entitiesConsumed: " + result.entitiesConsumed);
                console.log("entitiesInQueue: " + result.entitiesInQueue);
                console.log("maxWaitingTimeInTicks: " + result.maxWaitingTimeInTicks);
            });
        };
    }]);

})();