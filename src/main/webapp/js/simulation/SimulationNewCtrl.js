(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationNewCtrl', function ($scope, $location, $modal, SimResult, Simulation, Timetable, menu_field_name, menu_field_button) {

        // Help methods
        function debug() {
            console.log("dataset: ", $scope.dataset);
        }

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

        function addData(data, type) {
            var pos = $scope.control.getlastpos();
            $scope.control.addNode(type || "consumer", pos.x, pos.y, data);
        }

        $scope.updateTicks = function() {
            $scope.startTick = ($scope.startTime.getHours() * 60  * 60) + ($scope.startTime.getMinutes() * 60);
            $scope.ticks = ($scope.endTime.getHours() * 60 * 60) + ($scope.endTime.getMinutes() * 60) - $scope.startTick;
        };

        //Scope values
        $scope.startTime = new Date();
        $scope.startTime.setHours(6);
        $scope.startTime.setMinutes(0);

        $scope.endTime = new Date();
        $scope.endTime.setHours(8);
        $scope.endTime.setMinutes(0);

        $scope.breakpoints = 900; // Every 15 minutes

        $scope.updateTicks();

        $scope.options = []; // For dropdown in add consumer/passengerflow
        $scope.submit = submit;
        $scope.dataset = { nodes: [], edges: [] };
        $scope.control = {};
        $scope.addData = addData;
        $scope.debug = debug;

        // Set menu field name and button
        menu_field_name.readonly = false;
        menu_field_name.setValue("Untitled simulation");

        menu_field_button.value = "Submit";
        menu_field_button.icon = "fa-arrow-circle-right";
        menu_field_button.click = debug;


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

            function text(d) {
                if(d.type == "bus" || d.type == "train") {
                    return _.find(timetable, function(t) { return t.id == d.timetableId; }).name;
                }
                else if(d.type == "passengerflow")
                {
                    return "Persons per arrival: " + d.personsPerArrival + "<br/>" +
                           "Time between arrivals: " + ticksToTime(d.timeBetweenArrivals);
                }
                else if(d.type == "parking")
                {
                    return "Buses handled every " + ticksToTime(d.ticksToConsumeEntity);
                }
                else if(
                    d.type == "desktop" ||
                    d.type == "door" ||
                    d.type == "suitcase" ||
                    d.type == "consumerGroup-desktop" ||
                    d.type == "consumerGroup-door" ||
                    d.type == "consumerGroup-suitcase"
                )
                {
                    var printForConsumer =  "Passengers handled every " + ticksToTime(d.ticksToConsumeEntity);

                    if(d.type.indexOf("consumerGroup") != -1) {
                        printForConsumer += "<br/>" + "Quantity: " + d.numberOfConsumers;
                    }

                    return printForConsumer;
                }
                else
                {
                    return "Test";
                }
            }

            return d3.behavior
                .tooltip()
                .text(text);
        };

        // Modals
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

})();