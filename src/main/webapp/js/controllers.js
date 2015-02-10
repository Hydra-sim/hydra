(function() {

    'use strict';

    var app = angular.module('controllers', [
        'ngRoute',
        'services'
    ]);

    app.controller('ApplicationController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
        $rootScope.menu_field_button = "New Simulation";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() {
            $location.path('/newsimulation');
        };

        $rootScope.menu_field_name = "";
    }]);

    app.controller('SimulationController', ['$scope', 'Simulation', function ($scope, Simulation) {
        $scope.simulations = Simulation.query({});

        $scope.deleteSimulation = function(id) {

            Simulation.delete({}, {"id": id}, function() {
                $scope.simulations = Simulation.query({});
            });

        };
    }]);

    app.controller('SimulationNew', ['$scope', '$location', '$rootScope', 'Simulation', 'SimResult', function ($scope, $location, $rootScope, Simulation, SimResult) {
        $scope.timeBetweenBuses = 10;
        $scope.numberOfEntrances = 1;
        $scope.days = 0;
        $scope.hours = 1;
        $scope.minutes = 0;

        $rootScope.menu_field_name = "Untitled simulation 01";

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {
            var sim = new Simulation({
                'timeBetweenBuses': $scope.timeBetweenBuses,
                'numberOfEntrances': $scope.numberOfEntrances,
                'days': $scope.days,
                'hours': $scope.hours,
                'minutes': $scope.minutes
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

        $rootScope.menu_field_button = "test";
    }]);

})();