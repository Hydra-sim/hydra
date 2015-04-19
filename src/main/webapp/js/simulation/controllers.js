(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('NewConsumerInstanceCtrl', function($scope, $modalInstance, $log, ticksToConsumeEntitiesList, type){

        $scope.ticksToConsumeEntitiesList = ticksToConsumeEntitiesList;
        $scope.modalTitle = type;
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitConsumer = function(amountOfTime, timeSelectConsumer){

            $log.info(amountOfTime);
            $log.info(timeSelectConsumer.item.label);

            var ticksToConsumeEntities = amountOfTime; // Seconds by default


            if(timeSelectConsumer.item.label == "Minutes") { // Minutes

                ticksToConsumeEntities *= 60;

            } else if(timeSelectConsumer.item.label == "Hours") { // Hours

                ticksToConsumeEntities *= 60 * 60;
            }


            $scope.ticksToConsumeEntitiesList.push(ticksToConsumeEntities);

            $modalInstance.close();
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('NewProducerInstanceCtrl', function($scope, $modalInstance, Timetable, timetableIds, $log, type){

        $scope.timetableIds = timetableIds;
        $scope.modalTitle = type;

        function updateTimetableScope() {
            $scope.timetables = Timetable.query({});
        }
        updateTimetableScope();

        $scope.submitProducer = function(selectedItem){

            /*Lage funksjon som finner og returnerer aktiv tidstabell id så pushe den inn i $scope.timetableIds liste*/

            $log.info(selectedItem);
            timetableIds.push(selectedItem);


            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });

    app.controller("NewPassengerflowInstanceCtrl", function($scope, $modal, $modalInstance, $log, totalNumberOfEntititesList, numberOfEntitiesList, timeBetweenArrivalsList){
        $scope.totalNumberOfEntititesList = totalNumberOfEntititesList;
        $scope.numberOfEntitiesList = numberOfEntitiesList;
        $scope.timeBetweenArrivalsList = timeBetweenArrivalsList;

        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitPassengerflow =  function(totalNumberOfEntities, numberOfEntities, timeBetweenArrivals , timeSelect){


            $scope.totalNumberOfEntititesList.push(totalNumberOfEntities);
            $scope.numberOfEntitiesList.push(numberOfEntities);



            if(timeSelect.item.label == "Minutes"){
                timeBetweenArrivals *= 60;
            }
            else if(timeSelect.item.label == "Hours"){
                timeBetweenArrivals *= 60 * 60;
            }

            $scope.timeBetweenArrivalsList.push(timeBetweenArrivals);

            $modalInstance.close();
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

    });

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
    app.controller('ConfigModalInstanceCtrl', function ($scope, $modalInstance, startTime, endTime) {

        $scope.startTime = startTime;
        $scope.endTime = endTime;

        $scope.submitConfig = function () {
            var time = {startTime: $scope.startTime, endTime: $scope.endTime};

            $modalInstance.close(time);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('SimulationEditCtrl', function ($log, $scope, $routeParams, $rootScope, $location, Simulation, SimResult, menu_field_name) {

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


    app.controller('SimulationListCtrl', function ($scope, $log, Simulation, $location, $modal) {
        $scope.simulations = Simulation.query({});

        $scope.auth = function (id, funcDesc) {

            Simulation.get({}, {'id': id}, function (result) {

                var func;

                switch (funcDesc) {
                    case 'edit':
                        func = $scope.editSimulation;
                        break;
                    case 'delete':
                        func = $scope.deleteSimulation;
                        break;
                    case 'show':
                        func = $scope.showSimulation;
                        break;
                    case 'setPassword':
                        func = $scope.setPassword;
                        break;
                    default:
                        func = null;
                }

                if (result.passwordProtected) {              // It really does find it

                    $modal.open({
                        templateUrl: 'templates/modals/passwordAuth.html',
                        controller: 'PasswordInstanceCtrl',
                        size: 'sm',
                        resolve: {
                            id: function () {
                                return id;
                            },
                            func: function () {
                                return func;
                            }
                        }
                    });

                } else {

                    func(id);
                }
            });
        };

        $scope.deleteSimulation = function (id) {

            var modalInstance = $scope.confirmation();

            modalInstance.result.then(function (selectedItem) {
                Simulation.delete({}, {"id": id}, function () {
                    $scope.simulations = Simulation.query({});
                });
            });
        };

        $scope.confirmation = function() {

            $scope.confirmed = false;

            var modalInstance = $modal.open({
                templateUrl: 'templates/modals/confirmation.html',
                controller: 'ConfirmationInstanceCtrl',
                size: 'sm'
            });

            return modalInstance;
        };

        $scope.editSimulation = function (id) {

            $location.path('/simulation/' + id);

        };

        $scope.shareSimulation = function (id) {

            var path = $location.url();

            $modal.open({
                templateUrl: 'templates/modals/shareSimulation.html',
                controller: 'ShareSimulationInstanceCtrl',
                size: 'sm',
                resolve: {
                    id: function () {
                        return id;
                    },
                    message: function(){
                        return 'www.pj6000.me/hydra/#' + path + 'simulation/' + id;
                    }
                }
            });

        };

        $scope.showSimulation = function (id) {

            $location.path('/show/' + id);
        };

        $scope.setPassword = function (id) {

            Simulation.get({}, {'id': id}, function (result) {

                if (result.passwordProtected) {              // It really does find it

                    $modal.open({
                        templateUrl: 'templates/modals/changePassword.html',
                        controller: 'ChangePasswordCtrl',
                        size: 'sm',
                        resolve: {
                            id: function () {
                                return id;
                            }
                        }
                    });

                } else {

                    $modal.open({
                        templateUrl: 'templates/modals/newPassword.html',
                        controller: 'NewPasswordCtrl',
                        size: 'sm',
                        resolve: {
                            id: function () {
                                return id;
                            }
                        }
                    });
                }
            });
        };

        $scope.newPassword = function( id ) {

        };

        $scope.changePassword = function( id ) {

        };
    });


    app.controller('SimulationNewCtrl', function ($scope, $location, $rootScope, $modal, $log, Simulation, SimResult, menu_field_name) {

        $scope.updateTicks = function() {

            $scope.startTick = ($scope.startTime.getHours() * 60  * 60) + ($scope.startTime.getMinutes() * 60);
            $scope.ticks = ($scope.endTime.getHours() * 60 * 60) + ($scope.endTime.getMinutes() * 60) - $scope.startTick;
        };

        //Default values
        $scope.startTime = new Date();
        $scope.startTime.setHours(6);
        $scope.startTime.setMinutes(0);

        $scope.endTime = new Date();
        $scope.endTime.setHours(8);
        $scope.endTime.setMinutes(0);

        $scope.updateTicks();

        $scope.ticksToConsumeEntitiesList = [];
        $scope.timetableIds = [];

        $scope.consumerGroupNames = [];
        $scope.numberOfConsumersInGroups = [];
        $scope.ticksToConsumeEntitiesGroups = [];

        $scope.totalNumberOfEntititesList = [];
        $scope.numberOfEntitiesList = [];
        $scope.timeBetweenArrivalsList = [];


        // For dropdown in add consumer/passengerflow
        $scope.options = [];

        menu_field_name.setValue("Untitled simulation");

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {

            $scope.updateTicks();

            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            $scope.ticks,
                'ticksToConsumeEntitiesList' :      $scope.ticksToConsumeEntitiesList,
                'timetableIds' :                    $scope.timetableIds,
                'consumerGroupNames' :              $scope.consumerGroupNames,
                'numberOfConsumersInGroups' :       $scope.numberOfConsumersInGroups,
                'ticksToConsumeEntitiesGroups' :    $scope.ticksToConsumeEntitiesGroups,
                'totalNumberOfEntititesList':       $scope.totalNumberOfEntititesList,
                'numberOfEntitiesList':             $scope.numberOfEntitiesList,
                'timeBetweenArrivalsList':          $scope.timeBetweenArrivalsList
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
                {source: {id: 1}, target: {id: 0}}
            ]
        };

        $scope.addData = function() {
            var id = _.max($scope.dataset.nodes, function(node) { return node.id; }).id + 1;

            console.log(id);

            $scope.dataset.nodes.push(
                {type: "consumer", id: id, x: 400, y: 100}
            );
        };

        $scope.newProducer = function (type) {

            $modal.open({
                templateUrl: 'templates/modals/newProducer.html',
                controller: 'NewProducerInstanceCtrl',
                size: 'sm',
                resolve: {
                    timetableIds: function () {
                        return $scope.timetableIds;
                    },
                    type: function () {
                        return type;
                    }
                }
            });
        };

        $scope.newConsumer = function (type) {

            $modal.open({
                templateUrl: 'templates/modals/newConsumer.html',
                controller: 'NewConsumerInstanceCtrl',
                size: 'sm',
                resolve: {

                    //  ticksToConsumeEntitiesList, type, timeSelectConsumer
                    ticksToConsumeEntitiesList: function () {
                        return $scope.ticksToConsumeEntitiesList;
                    },
                    type: function(){
                        $scope.type = type;
                        return $scope.type;
                    }
                }
            });
        };

        $scope.newConsumerGroup = function() {

            $modal.open({
                templateUrl: 'templates/modals/newConsumerGroup.html',
                controller: 'ConsumerGroupInstanceCtrl',
                size: 'sm',
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

        $scope.newPassengerflow = function(){
            $modal.open({
                templateUrl: 'templates/modals/newPassengerflow.html',
                controller: 'NewPassengerflowInstanceCtrl',
                size: 'sm',
                resolve: {
                    totalNumberOfEntititesList: function(){
                        return $scope.totalNumberOfEntititesList;
                    },
                    numberOfEntitiesList: function(){
                        return $scope.numberOfEntitiesList;
                    },
                    timeBetweenArrivalsList: function(){
                        return $scope.timeBetweenArrivalsList;
                    }
                }
            });
        };

        $scope.openConfigModal = function() {

            var configModal = $modal.open({
                templateUrl: 'templates/modals/configModal.html',
                controller: 'ConfigModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    startTime: function() {
                        return $scope.startTime;
                    },
                    endTime: function() {
                        return $scope.endTime;
                    }
                }
            });

            configModal.result.then(function (time) {
                $scope.startTime = time.startTime;
                $scope.endTime = time.endTime;
                $scope.updateTicks();
            });
        };

        $scope.choosePreset = function(){
            $modal.open({
                templateUrl: 'templates/modals/choosePreset.html',
                controller:  'ChoosePresetInstanceCtrl',
                size: 'sm'
            });
        };
    });


})();