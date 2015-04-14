(function() {

    'use strict';

    var app = angular.module('simulation', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'angularFileUpload'
    ]);

    app.controller('ChoosePresetInstanceCtrl', function($scope, $modalInstance){
        $scope.loadPreset = function(preset){

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('ConsumerGroupInstanceCtrl', function($scope, $modalInstance, consumerGroupNames, numberOfConsumersInGroups,
                                                ticksToConsumeEntitiesGroups) {

        $scope.consumerGroupNames = consumerGroupNames;
        $scope.numberOfConsumersInGroups = numberOfConsumersInGroups;
        $scope.ticksToConsumeEntitiesGroups = ticksToConsumeEntitiesGroups;

        $scope.submitConsumerGroup = function(consumerGroupName, numberOfConsumersInGroup, ticksToConsumeEntitiesGroup){
            consumerGroupNames.push( consumerGroupName );
            numberOfConsumersInGroups.push( numberOfConsumersInGroup );
            ticksToConsumeEntitiesGroups.push( ticksToConsumeEntitiesGroup );
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
    app.controller('ConfigModalInstanceCtrl', function ($scope, $modalInstance, $log) {
        $scope.days = 0;
        $scope.hours = 1;
        $scope.minutes = 0;

        $scope.submitConfig = function (days, hours, minutes) {
            var ticks = ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
            $modalInstance.close(ticks);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('SimulationEditCtrl', function ($log, $scope, $routeParams, $rootScope, $location, Simulation, SimResult,
                                               menu_field_name) {

        Simulation.get({}, {"id": $routeParams.id}, function(result) {
            $scope.id = result.id;

            menu_field_name.setValue(result.name);

            $scope.ticks = result.ticks;

            $scope.ticksToConsumeEntitiesList = [];

            for(var i = 0; i < result.consumers.length; i++) {
                $scope.ticksToConsumeEntitiesList.push (result.consumers[i].ticksToConsumeEntities);
            }

            $scope.timetableIds = [];

            for(var i = 0; i < result.producers.length; i++) {
                $scope.timetableIds.push(result.producers[i].timetable.id);
            }
        });

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {
            var sim = new Simulation({
                'name': menu_field_name.value,
                'ticks': $scope.ticks,

                'ticksToConsumeEntitiesList' : $scope.ticksToConsumeEntitiesList,
                'timetableIds' : $scope.timetableIds
            });

            sim.$save().then(function(result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
            });
        };
    });
    app.controller('SimulationResultCtrl', function($scope, $rootScope, SimResult) {
        $scope.entitiesConsumed         = SimResult.data.entitiesConsumed;
        $scope.entitiesInQueue          = SimResult.data.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = SimResult.data.maxWaitingTimeInTicks;

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    });

    app.controller('SimulationShowCtrl', function($scope, $rootScope, $routeParams, Simulation) {
        Simulation.get({}, {"id": $routeParams.id}, function(data) {
            console.log(data);

            $scope.entitiesConsumed         = data.result.entitiesConsumed;
            $scope.entitiesInQueue          = data.result.entitiesInQueue;
            $scope.maxWaitingTimeInTicks    = data.result.maxWaitingTimeInTicks;
        });

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    });

})();