(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationEditCtrl', function ($scope, $routeParams, $rootScope, $location, $log, Simulation, SimResult, menu_field_name) {

        Simulation.get({}, {"id": $routeParams.id}, function (result) {

            var simAuth = false;

            for(var i = 0; i < $rootScope.simulationAuth.length; i++) {

                if($rootScope.simulationAuth[i] == $routeParams.id) simAuth = true;
            }

            if(result.passwordProtected && simAuth) {

                $scope.id = result.id;

                menu_field_name.setValue(result.name);

                $scope.ticks = result.ticks;

                $scope.ticksToConsumeEntitiesList = [];

                for (var j = 0; j < result.consumers.length; j++) {
                    $scope.ticksToConsumeEntitiesList.push(result.consumers[j].ticksToConsumeEntities);
                }

                $scope.timetableIds = [];

                for (var j = 0; j < result.producers.length; j++) {
                    $scope.timetableIds.push(result.producers[j].timetable.id);
                }

            } else if(result.passwordProtected && !simAuth){

                $location.path("simulation/" + $routeParams.id + "/auth")
            }
        });

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function () {
            var sim = new Simulation({
                'name': menu_field_name.value,
                'ticks': $scope.ticks,

                'ticksToConsumeEntitiesList': $scope.ticksToConsumeEntitiesList,
                'timetableIds': $scope.timetableIds
            });

            sim.$save().then(function (result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
            });
        };

    });

    app.controller('SimulationResultCtrl', function($scope, $rootScope, SimResult, cfpLoadingBar) {

        $scope.loaded = false;

        cfpLoadingBar.start();

        SimResult.data.then(function(result) {

            $scope.simulation = result;
            console.log(result);

            // Close the loading bar
            cfpLoadingBar.complete();
            $scope.loaded = true;

            var from  = $scope.simulation.startTick;

            $scope.fromHours = from / 60 / 60;
            $scope.fromMinutes = (from - ($scope.fromHours * 60 * 60)) / 60;

            var to = from + $scope.simulation.ticks;

            $scope.toHours = to / 60 / 60;
            $scope.toMinutes = (to - ($scope.toHours * 60 * 60)) / 60;

            $scope.maxWaitingTimeInMinutes = $scope.simulation.result.maxWaitingTimeInTicks / 60;

        });

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    });

    app.controller('SimulationShowCtrl', function($scope, $rootScope, $routeParams, SimResult) {

        var data = SimResult.data;

        $scope.entitiesConsumed         = data.result.entitiesConsumed;
        $scope.entitiesInQueue          = data.result.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = data.result.maxWaitingTimeInTicks;


        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    });

    app.controller('SimulationListCtrl', function ($scope, $rootScope, $log, Simulation, $location, $modal) {

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

    app.controller('SimulationNewCtrl', function ($scope, $location, $rootScope, $modal, SimResult, Simulation, menu_field_name) {

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
        $rootScope.menu_field_button_click = submit;
        $scope.submit = submit;
        function submit() {

            $scope.debug();
            $scope.updateTicks();

            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            $scope.ticks,
                'startTick':                        $scope.startTick,
                'nodes':                            $scope.dataset.nodes,
                'edges':                            $scope.dataset.edges
            });

            SimResult.data = sim.$save();
            $location.path('/result');
            $location.replace();
        };

        $scope.dataset = { nodes: [], edges: [] };

        $scope.control = {};
        $scope.addData = addData;
        function addData(data, type) {
            var pos = $scope.control.getlastpos();
            $scope.control.addNode(type || "consumer", pos.x, pos.y, data);
        }

        $scope.debug = function() {
            console.log("dataset: ", $scope.dataset);
        };

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
            }).result.then(function(data) {
                addData(data, type)
            });
        };

        $scope.newConsumer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newConsumer.html',
                controller: 'NewConsumerModalCtrl',
                size: 'sm',
                resolve: {
                    type: function(){
                        return title;
                    }
                }
            }).result.then(function(data) {

                if(data.hasOwnProperty('numberOfConsumers')) {

                    addData(data, 'consumerGroup')

                } else {

                    addData(data, type)
                }
            });
        };

        $scope.newPassengerflow = function(){
            $modal.open({
                templateUrl: 'templates/modals/newPassengerflow.html',
                controller: 'NewPassengerflowModalCtrl',
                size: 'sm'
            }).result.then(function(data) {
                addData(data, 'passengerflow');
            });
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

    app.controller('SimulationProgressCtrl', function($scope, $log, $interval) {

        $scope.steps = 1;
        $scope.progress = {};
        $scope.progress.position = 0;

        var intervalPromise;

        $scope.forward = function() {

            $interval.cancel(intervalPromise);
            $scope.changeTime(1);
        };

        $scope.backward = function() {

            $interval.cancel(intervalPromise);
            $scope.changeTime(-1);
        };

        $scope.pause = function() {

            $interval.cancel(intervalPromise);
        };

        $scope.changeTime = function(value) {

            intervalPromise = $interval(function () {

                if($scope.progress.position >= 0 && $scope.progress.position <= 100) $scope.progress.position += value;
                $log.info($scope.progress.position);

            }, 100); // Milliseconds, iterations
        }
    });

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
        };

        $scope.cancel = function(){
            $modalInstance.dismiss('close');
        }
    });

    app.controller('NewConsumerModalCtrl', function($scope, $modalInstance, type){

        $scope.groupable = !!(type.toLowerCase() == 'new bagdrop' || type.toLowerCase() == 'new terminal');

        $scope.modalTitle = type;
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitConsumer = function(amountOfTime, timeSelectConsumer, numberOfConsumers){

            var ticksToConsumeEntities = amountOfTime; // Seconds by default

            switch(timeSelectConsumer.item.label) {

                case "Minutes":
                    ticksToConsumeEntities *= 60;
                    break;

                case "Hours":
                    ticksToConsumeEntities *= 60 * 60;
                    break;
            }

            if($scope.group) {

                $modalInstance.close({

                    'ticksToConsumeEntity': ticksToConsumeEntities,
                    'numberOfConsumers': numberOfConsumers
                });

            } else {

                $modalInstance.close({

                    'ticksToConsumeEntity': ticksToConsumeEntities
                });
            }
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
                'timetableId': selectedItem
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });

    app.controller("NewPassengerflowModalCtrl", function($scope, $modal, $modalInstance){
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitPassengerflow =  function(totalNumberOfEntities, numberOfEntities, timeBetweenArrivals , timeSelect){
            if(timeSelect.item.label == "Minutes"){
                timeBetweenArrivals *= 60;
            }
            else if(timeSelect.item.label == "Hours"){
                timeBetweenArrivals *= 60 * 60;
            }

            $modalInstance.close({
                'timeBetweenArrivals': timeBetweenArrivals,
                'personsPerArrival': numberOfEntities
            });
        };

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

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

    app.controller('PasswordModalCtrl', function($scope, $rootScope, $modalInstance, id, func, Authentication) {

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
                    $rootScope.simulationAuth.push(id);

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

    app.controller('AuthPathCtrl', function($scope, $rootScope, $routeParams, $location, Authentication, menu_field_name) {

        $scope.id = $routeParams.id;

        $scope.wrongPassword = false;

        $scope.submitPassword = function(input) {

            var auth = new Authentication({
                'id': $routeParams.id,
                'input': input
            });

            auth.$save().then(function (result) {

                if (result.truefalse) {

                    $rootScope.simulationAuth.push($routeParams.id);
                    $location.path('/simulation/' + $routeParams.id);

                } else {

                    $scope.wrongPassword = true;
                    $rootScope.simulationAuth.push($routeParams.id);
                }
            });
        };

        menu_field_name.setValue("");
        menu_field_name.disable();

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function () {};
    });

    app.controller('TooltipProducerCtrl', function($scope, $tooltip, Timetable){

        $tooltip.open({
            templateUrl: 'templates/tooltip/inner-tooltip-producer.html',
            controller: 'TooltipProdCtrl',
            poxX: 200,
            posY: 200
        });
    });

    app.controller('TooltipPassengerflowCtrl', function($scope, $tooltip){

        $tooltip.open({
            templateUrl: 'templates/tooltip/inner-tooltip-passengerflow.html',
            controller: 'TooltipPassflowCtrl',
            poxX: 200,
            posY: 200
        });
    });

    app.controller('TooltipConsumerCtrl', function($scope, $tooltip){

        $tooltip.open({
            templateUrl: 'templates/tooltip/inner-tooltip-consumer.html',
            controller: 'TooltipConsCtrl',
            poxX: 200,
            posY: 200
        });
    });


})();