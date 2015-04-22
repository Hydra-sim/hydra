(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('NewConsumerModalCtrl', function($scope, $modalInstance, ticksToConsumeEntitiesList, type){
        $scope.ticksToConsumeEntitiesList = ticksToConsumeEntitiesList;
        $scope.modalTitle = type;
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitConsumer = function(amountOfTime, timeSelectConsumer){
            var ticksToConsumeEntities = amountOfTime; // Seconds by default

            if(timeSelectConsumer.item.label == "Minutes") { // Minutes
                ticksToConsumeEntities *= 60;

            } else if(timeSelectConsumer.item.label == "Hours") { // Hours
                ticksToConsumeEntities *= 60 * 60;
            }

            $modalInstance.close({
                'ticksToConsumeEntities': ticksToConsumeEntities
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('NewProducerModalCtrl', function($scope, $modalInstance, Timetable, timetableIds, type){
        $scope.timetableIds = timetableIds;
        $scope.modalTitle = type;

        function updateTimetableScope() {
            $scope.timetables = Timetable.query({});
        }
        updateTimetableScope();

        $scope.submitProducer = function(selectedItem){
            $modalInstance.close({
                'timetable': selectedItem
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });

    app.controller("NewPassengerflowModalCtrl", function($scope, $modal, $modalInstance, totalNumberOfEntititesList, numberOfEntitiesList, timeBetweenArrivalsList){
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

            $modalInstance.close({
                'timeBetweenArrivals': timeBetweenArrivals
            });
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

    });

    app.controller('ChoosePresetModalCtrl', function($scope, $modalInstance){
        $scope.loadPreset = function(preset){
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('ConsumerGroupModalCtrl', function($scope, $modalInstance, consumerGroupNames, numberOfConsumersInGroups,
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
    app.controller('ConfigModalModalCtrl', function ($scope, $modalInstance, startTime, endTime) {

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

    app.controller('SimulationEditCtrl', function ($scope, $routeParams, $rootScope, $location, Simulation, SimResult, menu_field_name) {

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
        $scope.producerTooltip =  'Next arrival: 14:20 \n Passengers: 40 \n Persons delivered: 120 \n Persons remaining: 0';
        $scope.consumerTooltip = "Number in line: 10 \n Longest waiting time: 40 seconds";
        $scope.parkingTooltip = "Number arrived: 6";

        $scope.startTime                = SimResult.data.startTime;
        $scope.endTime                  = SimResult.data.endTime;
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

    app.controller('SimulationListCtrl', function ($scope, Simulation, $location, $modal) {

        function updateSimulations() {
            $scope.simulations = Simulation.query({});
        }

        updateSimulations();

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
                        controller: 'PasswordModalCtrl',
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
                controller: 'ConfirmationModalCtrl',
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
                controller: 'ShareSimulationModalCtrl',
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

                var path;

                if (result.passwordProtected) {              // It really does find it

                    path = 'templates/modals/changePassword.html';

                } else {

                    path = 'templates/modals/newPassword.html';
                }

                $modal.open({
                    templateUrl: path,
                    controller: 'ChangePasswordCtrl',
                    size: 'sm',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });
            });
        };
    });

    app.controller('SimulationNewCtrl', function ($scope, $location, $rootScope, $modal, Simulation, SimResult, menu_field_name) {

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
                'nodes':                            $scope.dataset.nodes,
                'edges':                            $scope.dataset.edges
            });

            sim.$save().then(function(result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
                console.log(result);
            });
        };

        $scope.dataset = { nodes: [], edges: [] };

        $scope.control = {};
        $scope.addData = addData;
        function addData(type) {
            var pos = $scope.control.getlastpos();
            $scope.control.addNode(type || "consumer", pos.x, pos.y);
        }

        $scope.newProducer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newProducer.html',
                controller: 'NewProducerModalCtrl',
                size: 'sm',
                resolve: {
                    timetableIds: function () {
                        return $scope.timetableIds;
                    },
                    type: function () {
                        return title;
                    }
                }
            }).result.then(function() {
                addData(type)
            });
        };

        $scope.newConsumer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newConsumer.html',
                controller: 'NewConsumerModalCtrl',
                size: 'sm',
                resolve: {
                    //  ticksToConsumeEntitiesList, type, timeSelectConsumer
                    ticksToConsumeEntitiesList: function () {
                        return $scope.ticksToConsumeEntitiesList;
                    },
                    type: function(){
                        return title;
                    }
                }
            }).result.then(function() {
                addData(type)
            });
        };

        $scope.newConsumerGroup = function() {

            $modal.open({
                templateUrl: 'templates/modals/newConsumerGroup.html',
                controller: 'ConsumerGroupModalCtrl',
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

            }).result.then(addData);
        };

        $scope.newPassengerflow = function(){
            $modal.open({
                templateUrl: 'templates/modals/newPassengerflow.html',
                controller: 'NewPassengerflowModalCtrl',
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
            }).result.then(addData);
        };

        $scope.openConfigModal = function() {

            var configModal = $modal.open({
                templateUrl: 'templates/modals/configModal.html',
                controller: 'ConfigModalModalCtrl',
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
                controller:  'ChoosePresetModalCtrl',
                size: 'sm'
            });
        };

    });

    app.controller('ChangePasswordCtrl', function( $scope, $modalInstance, $rootScope, $location, id, Simulation ) {


        $scope.passwordMismatch = false;

        $scope.submitPassword = function( password, repPassword ) {

            if(password == repPassword) {

                var sim = new Simulation({
                    'id':    id,
                    'input': password
                });

                Simulation.update({}, sim).$promise.then(function() {
                    $rootScope.$emit('updateSimulations');
                    $location.path('/#');
                });

                $modalInstance.close();

            } else {

                $scope.passwordMismatch = true;
            }

        };

        $scope.deletePassword = function () {

            $scope.submitPassword(null);
        };

        $scope.cancel = function(){
            $modalInstance.dismiss();
        };
    });

    app.controller('PasswordModalCtrl', function($scope, $modalInstance, id, func, Authentication) {

        $scope.id = id;

        $scope.wrongPassword = false;

        $scope.submitPassword = function(input){

            var auth = new Authentication({
                'id':    id,
                'input': input
            });

            auth.$save().then(function(result) {

                if(result.truefalse) {

                    func(id);
                    $modalInstance.close();

                } else {

                    $scope.wrongPassword = true;
                }
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('ConfirmationModalCtrl', function($scope, $modalInstance) {

        $scope.confirm = function(){

            $modalInstance.close();
        };

        $scope.cancel = function() {

            $modalInstance.dismiss();
        }
    });

    app.controller('SimulationProgressCtrl', function() {

    });


    app.controller('TooltipTestCtrl', function($scope){
        var tooltip = angular.element(document.querySelector(".custom-tooltip"));
        var path = "templates/tooltip/";

        $scope.open = function(templateUrl, posX, posY){
            tooltip.empty();
            tooltip.append("<div class='inner-tooltip' ng-include src='" + path + templateUrl + "\'></div>");
            tooltip.css({
               "position": "absolute",
                "opacity": "1",
                left: posX + "px",
                top: posY + "px"
            });
        }
    })

    app.controller('ShareSimulationModalCtrl', function($scope, $modalInstance, $location, $log, id, message){

        $scope.id = id;
        $scope.message = message;

        $scope.copySimulation = function(){

            $scope.complete = function(e) {
                console.log('copy complete', e);
                $scope.copied = true
            };
            $scope.$watch('input', function(v) {
                $scope.copied = false
            });
            $scope.clipError = function(e) {
                console.log('Error: ' + e.name + ' - ' + e.message);
            };

            $modalInstance.close();
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('close');
        }
    });3

})();