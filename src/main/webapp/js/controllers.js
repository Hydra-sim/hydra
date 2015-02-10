(function() {

    'use strict';

    var app = angular.module('controllers', [
        'ngRoute',
        'services'
    ]);

    app.controller('ApplicationController', ['$scope', '$location', function($scope, $location) {
        $scope.newsimulation = function() {
            $location.path('/newsimulation')
        }
    }]);

    app.controller('SimulationController', ['$scope', 'Simulation', function ($scope, Simulation) {
        $scope.simulations = Simulation.query({});

        $scope.deleteSimulation = function(id) {

            Simulation.delete({}, {"id": id}, function() {
                $scope.simulations = Simulation.query({});
            });

        };
    }]);

    app.controller('SimulationNew', ['$scope', '$location', 'Simulation', 'SimResult', function ($scope, $location, Simulation, SimResult) {
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

    app.controller('SimulationResult', ['$scope', '$rootScope', 'SimResult', function($scope, $rootScope, SimResult) {
        $scope.entitiesConsumed         = SimResult.data.entitiesConsumed;
        $scope.entitiesInQueue          = SimResult.data.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = SimResult.data.maxWaitingTimeInTicks;

        $rootScope.menu_field_1 = "test";
    }]);

})();