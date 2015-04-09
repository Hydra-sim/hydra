(function() {

    'use strict';

    var app = angular.module('simulation', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'angularFileUpload'
    ]);

    app.controller('SimulationController', function ($scope, Simulation, $location, $modal) {
        $scope.simulations = Simulation.query({});

        $scope.deleteSimulation = function(id) {

            Simulation.delete({}, {"id": id}, function() {
                $scope.simulations = Simulation.query({});
            });

        };

        $scope.editSimulation = function(id) {

            $modal.open({
                templateUrl: 'passwordAuth.html',
                //controller: 'ConsumerGroupInstanceCtrl',
                size: size
            });

            $location.path('/simulation/' + id);
        };
    });

    app.controller('SimulationNew', function ($scope, $location, $rootScope, $modal, Simulation, SimResult, menu_field_name) {
        //Default values
        $scope.ticks = 60;
        $scope.ticksToConsumeEntitiesList = [];
        $scope.timetableIds = [];

        $scope.consumerGroupNames = [];
        $scope.numberOfConsumersInGroups = [];
        $scope.ticksToConsumeEntitiesGroups = [];

        // For dropdown in add consumer/passengerflow
        $scope.options = [];

        menu_field_name.setValue("Untitled simulation");

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {
            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            $scope.ticks,
                'ticksToConsumeEntitiesList' :      $scope.ticksToConsumeEntitiesList,
                'timetableIds' :                    $scope.timetableIds,
                'consumerGroupNames' :              $scope.consumerGroupNames,
                'numberOfConsumersInGroups' :       $scope.numberOfConsumersInGroups,
                'ticksToConsumeEntitiesGroups' :    $scope.ticksToConsumeEntitiesGroups
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

        $scope.newProducer = function (size, type) {

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
                    },
                    type: function(){
                        if(type == "train"){
                            $scope.type = "NEW TRAIN";
                        }
                        if(type == "bus"){
                            $scope.type = "NEW BUS";
                        }
                        return $scope.type;
                    }
                }
            });
        };

        $scope.newConsumer = function (size, type) {

            $modal.open({
                templateUrl: 'newConsumer.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {

                    ticksToConsumeEntitiesList: function () {
                        return $scope.ticksToConsumeEntitiesList;
                    },
                    timetableIds: function () {
                        return $scope.timetableIds;
                    },
                    type: function(){
                        if(type == "terminal"){
                            $scope.type = "NEW TERMINAL";
                        }
                        if(type == "door"){
                            $scope.type = "NEW DOOR";
                        }
                        return $scope.type;
                    }
                }
            });
        };

        $scope.newConsumerGroup = function(size) {

            $modal.open({
                templateUrl: 'newConsumerGroup.html',
                controller: 'ConsumerGroupInstanceCtrl',
                size: size,
                resolve: {
                    consumerGroupNames: function () {
                        return $scope.consumerGroupNames;
                    },
                    numberOfConsumersInGroups: function () {
                        return $scope.numberOfConsumersInGroups;
                    },
                    ticksToConsumeEntitiesGroups: function() {
                        return $scope.ticksToConsumeEntitiesGroups;
                    }
                }

            });
        };

        $scope.newPassengerflow = function(size){
            $modal.open({
                templateUrl: 'newPassengerflow.html',
                controller: 'newPassengerflowInstanceCtrl',
                size: size
            });
        };

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

    app.controller("radialMenuController", function(){

        var circularMenu = document.querySelector('.circular-menu');
        var openBtn = document.querySelector('.menu-button');
        var items = document.querySelectorAll('.outer-circle .circle');

        for(var i = 0, l = items.length; i < l; i++) {
            items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
        }

        document.querySelector('.graph').onclick = function(e) {
            e.preventDefault();

            openBtn.style.display = "block";
            document.querySelector('.outer-circle').classList.add('open');

            var xPosition = e.clientX  - (circularMenu.clientWidth / 2);
            var yPosition = e.clientY  - (circularMenu.clientHeight / 2);

            circularMenu.style.left = xPosition + "px";
            circularMenu.style.top = yPosition  + "px";
        };

        openBtn.onclick = function(e){
            document.querySelector('.outer-circle').classList.remove('open');
            openBtn.style.display = "none";
        }



    });

    app.controller('choosePresetInstanceCtrl', function($scope, $modalInstance){

        $scope.loadPreset = function(){
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
    app.controller('newProducerInstanceCtrl', function($scope, $modalInstance, timetable, timetableIds, selectedItem){

       $scope.timetableIds = timetableIds;

        function updateTimetables(){
            $scope.timetables = timetable.query({});
        }

        updateTimetables()

        $scope.submitProducer = function(){


            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('newConsumerInstanceCtrl', function($scope, $modalInstance){

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });


    app.controller('newPassengerflowInstanceCtrl', function($scope, $modelInstance){

        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitPassengerflow = function(){
            $modelInstance.close();
        };

        $scope.cancel = function () {
            $modelInstance.dismiss('cancel');
        };

    });

    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $log, ticksToConsumeEntitiesList,
                                                  Timetable, timetableIds, type) {
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.ticksToConsumeEntitiesList = ticksToConsumeEntitiesList;

        $scope.modalTitle = type;

        $scope.submitConsumer = function (ticksToConsumeEntities) {

            $scope.ticksToConsumeEntitiesList.push( ticksToConsumeEntities );

            $modalInstance.close();
        };

        $scope.timetableIds = timetableIds;

        function updateTimetableScope() {
            $scope.timetables = Timetable.query({});
        }
        updateTimetableScope();

        $scope.submitProducer = function () {
            $scope.active = function() {
                return $scope.timetables.filter(function(timetable){
                    return timetable;
                })[0];



            };
            $scope.timetableIds.push( $scope.active().id );
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