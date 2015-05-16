(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationNewCtrl', function ($scope, $location, $modal, $routeParams, $rootScope, SimResult, Simulation, Timetable, menu_field_name, menu_field_button, TmpSimulationData, Upload) {

        var that = this;

        $scope.dataset = { nodes: [], edges: [] };

        $scope.$watchCollection('dataset.nodes', function(newvalue) {
            TmpSimulationData.nodes = newvalue;
        });

        $scope.$watchCollection('dataset.edges', function(newvalue) {
            TmpSimulationData.edges = newvalue;
        });

        // Help methods
        function debug() {
            console.log("$scope.dataset", $scope.dataset);
            console.log("TmpSimulationData", TmpSimulationData);
        }

        function submit() {
            $scope.updateTicks();

            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            $scope.ticks,
                'startTick':                        $scope.startTick,
                'nodes':                            TmpSimulationData.nodes,
                'edges':                            TmpSimulationData.edges
            });

            /* // Edit modal saveAs dialog
            $modal.open({

                templateUrl: 'templates/modals/saveAs.html',
                controller: 'SaveAsModalCtrl',
                size: 'sm',
                resolve: {
                    simulationName: function () {
                        return menu_field_name.value;
                    }
                }

            }).result.then(function (data) {

                SimResult.data = sim.$save();
                $location.path('/result');
                $location.replace();
            }); //*/

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

        $scope.updateTime = function (result) {

            var hours = result.startTick / 60 / 60;
            $scope.startTime.setHours(hours);

            var minutes = (result.startTick - (hours * 60 * 60)) / 60;
            $scope.startTime.setMinutes(minutes);

            var hours = (result.startTick + result.ticks) / 60 / 60;
            $scope.endTime.setHours(hours);

            var minutes = ((result.startTick + result.ticks) - (hours * 60 * 60)) / 60;
            $scope.endTime.setMinutes(minutes);
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

        $scope.control = {};
        $scope.addData = addData;
        $scope.debug = debug;

        // Set menu field name and button
        menu_field_name.readonly = false;
        menu_field_name.setValue("Untitled simulation");

        menu_field_button.value = "Submit";
        menu_field_button.icon = "fa-arrow-circle-right";
        menu_field_button.click = submit;

        // Map / image uploading
        this.image = {};

        this.openMapModal = function() {
            var promise = $modal.open({
                templateUrl: 'templates/modals/mapModal.html',
                controller: 'MapModalCtrl',
                controllerAs: 'ctrl'
            });

            promise.result.then(function(data) {
                Upload.upload({
                    url: 'api/map',
                    file: data.file,
                    fields: {
                        'zoom': data.zoom
                    }
                }).success(function(d) {
                    that.image.url = 'api/map/' + d.id;
                    that.image.id = d.id;
                    that.image.zoom = d.zoom;
                });
            });
        };

        this.deleteMap = function() {
            that.image.url = "";
            that.image.id = 0;
            that.image.zoom = 0;
        };

        //Function for ticks to seconds/minutes/hours
        function ticksToTime(ticks){
            if(ticks == 3600)   return "1 hour";
            if(ticks == 60)     return "1 minute";
            if(ticks == 1)      return "1 second";

            if(ticks > 3600)    return (ticks/3600).toFixed(2) + " hours";
            if(ticks > 60)      return (ticks/60).toFixed(2) + " minutes";
                                return ticks + " seconds";
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

        // If the id is set, try to load in the simulation data
        if(typeof $routeParams.id !== "undefined") {
            Simulation.get({}, {"id": $routeParams.id}, function (result) {

                var simAuth = false;

                console.log("loaded sim:", result);

                for (var i = 0; i < $rootScope.simulationAuth.length; i++) {

                    if ($rootScope.simulationAuth[i] == $routeParams.id) simAuth = true;
                }

                if (result.passwordProtected && !simAuth) {

                    $location.path("simulation/" + $routeParams.id + "/auth")

                } else {

                    menu_field_name.setValue(result.name);
                    $scope.id = result.id;

                    $scope.ticks = result.ticks;
                    $scope.startTick = result.startTick;
                    $scope.dataset.nodes = result.nodes;
                    $scope.dataset.edges = result.relationships;

                    $scope.updateTime(result);
                }
            });
        }

        // Modals
        $scope.newProducer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newProducer.html',
                controller: 'NewProducerModalCtrl',
                size: 'sm',
                resolve: {
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