(function() {

    'use strict';

    var app = angular.module('simulation', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'angularFileUpload'
    ]);

    app.controller('SimulationController', function ($scope, Simulation, $location) {
        $scope.simulations = Simulation.query({});

        $scope.deleteSimulation = function(id) {

            Simulation.delete({}, {"id": id}, function() {
                $scope.simulations = Simulation.query({});
            });

        };

        $scope.editSimulation = function(id) {
            $location.path('/simulation/' + id);
        };
    });

    app.controller('SimulationNew', function ($scope, $location, $rootScope, $modal, Simulation, SimResult, menu_field_name) {
        //Default values
        $scope.ticks = 60;
        $scope.ticksToConsumeEntitiesList = [];
        $scope.timetableIds = [];

        menu_field_name.setValue("Untitled simulation");

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

        $scope.dataset = {
            nodes: [
                {type: "producer", id: 0, x: 100, y: 100},
                {type: "producer", id: 1, x: 100, y: 300},
                {type: "consumer", id: 2, x: 300, y: 300}
            ],
            edges: [
                {source: 1, target: 0}
            ]
        };

        $scope.addData = function() {
            var id = _.max($scope.dataset.nodes, function(node) { return node.id; }).id + 1;
            $scope.dataset.nodes.push(
                {type: "consumer", id: id, x: 400, y: 100}
            );
        };

        $scope.newProducer = function (size) {

            $modal.open({
                templateUrl: 'newProducer.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    ticksToConsumeEntitiesList: function () {
                        return $scope.ticksToConsumeEntitiesList;
                    },
                    timetableIds: function () {
                        return $scope.timetableIds;
                    }
                }
            });
        };

        $scope.newConsumer = function (size) {

            $modal.open({
                templateUrl: 'newConsumer.html',
                controller: 'ModalInstanceCtrl',
                size: size
            });
        };

        $scope.newConsumerGroup = function(size) {

            $modal.open({
                templateUrl: 'newConsumerGroup.html',
                controller: 'ConsumerGroupInstanceCtrl',
                size: size,
                resolve: {
                    numberOfConsumersInGroup: function() {
                        return $scope.numberOfConsumersInGroup;
                    },
                    ticksToConsumeEntitiesGroup: function() {
                        return $scope.ticksToConsumeEntitiesGroup;
                    }
                }
            });
        };

        $scope.newPassenerflow = function(size){
            $modal.open({
                templateUrl: 'newPassengerflow.html',
                controller: 'newPassengerflowInstanceCtrl',
                size: size
            });
        }

        $scope.openConfigModal = function(size) {

            var configModal = $modal.open({
                templateUrl: 'configModal.html',
                controller: 'ConfigModalInstanceCtrl',
                size: size
            });

            configModal.result.then(function (ticks) {
                $scope.ticks = ticks;
            });
        };

        $scope.choosePreset = function(size){
            $modal.open({
                templateUrl: 'choosePreset.html',
                controller:  'choosePresetInstanceCtrl',
                size: size
            });
        };

    });

    app.controller('choosePresetInstanceCtrl', function($scope, $modalInstance){

        $scope.loadPreset = function(){

        }



    });

    app.controller('SimulationEdit', function ($log, $scope, $routeParams, $rootScope, $location, Simulation, SimResult,
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
    app.controller('SimulationResult', function($scope, $rootScope, SimResult) {
        $scope.entitiesConsumed         = SimResult.data.entitiesConsumed;
        $scope.entitiesInQueue          = SimResult.data.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = SimResult.data.maxWaitingTimeInTicks;

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    });

    app.controller('SimulationShow', function($scope, $rootScope, $routeParams, Simulation) {
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