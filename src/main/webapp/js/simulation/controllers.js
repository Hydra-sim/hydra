(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationNewCtrl', function ($scope, $location, $rootScope, $modal, SimResult, Simulation, menu_field_name, Timetable, menu_field_button) {

        $scope.updateTicks = function() {
            $scope.startTick = ($scope.startTime.getHours() * 60  * 60) + ($scope.startTime.getMinutes() * 60);
            $scope.ticks = ($scope.endTime.getHours() * 60 * 60) + ($scope.endTime.getMinutes() * 60) - $scope.startTick;
        };

        menu_field_name.readonly = false;

        //Default values
        $scope.startTime = new Date();
        $scope.startTime.setHours(6);
        $scope.startTime.setMinutes(0);

        $scope.endTime = new Date();
        $scope.endTime.setHours(8);
        $scope.endTime.setMinutes(0);

        $scope.breakpoints = 900; // Every 15 minutes

        $scope.updateTicks();

        //Function for ticks to seconds/minutes/hours
        function ticksToTime(ticks){
            if(ticks == 3600)   return "1 hour";
            if(ticks == 60)     return "1 minute";
            if(ticks == 1)      return "1 second";

            if(ticks > 3600)    return ticks/3600 + " hours";
            if(ticks > 60)      return ticks/60 + " minutes";
            if(ticks > 1)       return ticks + " seconds";
        }

        // Tooltip
        $scope.extraTooltip = function() {
            var timetable = Timetable.query({});

            return d3.behavior
                .tooltip()
                .text(function(d) {
                    if(d.type == "bus" || d.type == "train") {
                        return _.find(timetable, function(t) { return t.id == d.timetableId; }).name;
                    } else if(d.type == "passengerflow"){
                        return "Persons per arrival: " + d.personsPerArrival + "<br/>" +
                            " Time between arrivals: " + ticksToTime(d.timeBetweenArrivals);
                    } else if(d.type == "parking") {
                        return "Buses handled every " + ticksToTime(d.ticksToConsumeEntity);
                    } else if(d.type == "desktop" || d.type == "door" || d.type == "suitcase" || d.type == "consumerGroup-desktop") {
                        var printForConsumer =  "Passengers handled every " + ticksToTime(d.ticksToConsumeEntity);
                        if(d.type.indexOf("consumerGroup") != -1) {
                            printForConsumer += "<br/>" + "Quantity: " + d.numberOfConsumers;
                        }
                        return printForConsumer;
                    } else {
                        return "Test";
                    }
                });
        };

        // For dropdown in add consumer/passengerflow
        $scope.options = [];

        menu_field_name.setValue("Untitled simulation");

        menu_field_button.value = "Submit";
        menu_field_button.icon = "fa-arrow-circle-right";
        menu_field_button.click = submit;
        $scope.submit = submit;
        function submit() {

            $scope.debug();
            $scope.updateTicks();

            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            $scope.ticks,
                'startTick':                        $scope.startTick,
                'nodes':                            $scope.dataset.nodes,
                'edges':                            $scope.dataset.edges,
                'breakpoints':                      $scope.breakpoints
            });

            SimResult.data = sim.$save();
            $location.path('/result');
            $location.replace();
        }

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

                    type = 'consumerGroup-' + type;

                }

                addData(data, type)
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
        $scope.timetables = Timetable.query({});

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

})();