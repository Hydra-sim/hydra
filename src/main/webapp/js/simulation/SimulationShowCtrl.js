(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationShowCtrl', function($scope, menu_field_button, $routeParams, SimResult) {

        var data = SimResult.data;

        $scope.entitiesConsumed         = data.result.entitiesConsumed;
        $scope.entitiesInQueue          = data.result.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = data.result.maxWaitingTimeInTicks;

        menu_field_button.reset();
    });

})();