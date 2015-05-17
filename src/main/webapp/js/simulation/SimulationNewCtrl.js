(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationNewCtrl', function ($scope, $location, $modal, $routeParams, $rootScope, SimResult, Simulation, Timetable, menu_field_name, menu_field_button, Upload) {

        var that = this;

        //Scope values
        $scope.startTime = new Date();
        $scope.startTime.setHours(6);
        $scope.startTime.setMinutes(0);

        $scope.endTime = new Date();
        $scope.endTime.setHours(8);
        $scope.endTime.setMinutes(0);

        $scope.control = {};
        $scope.dataset = { nodes: [], edges: [] };

        // Help methods
        this.debug = debug;
        function debug() {
            console.log("$scope.dataset", $scope.dataset);
        }

        function submit() {
            var startTick =
                $scope.startTime.getHours() * 3600 +
                $scope.startTime.getMinutes() * 60;

            var ticks =
                $scope.endTime.getHours() * 3600 +
                $scope.endTime.getMinutes() * 60
                -startTick;

            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            ticks,
                'startTick':                        startTick ,
                'nodes':                            $scope.dataset.nodes,
                'edges':                            $scope.dataset.edges
            });

            SimResult.data = sim.$save();
            $location.path('/result');
            $location.replace();
        }

        function addData(data, type) {
            var pos = $scope.control.getlastpos();
            $scope.control.addNode(type || "consumer", pos.x, pos.y, data);
        }


        // Set menu field name and button
        menu_field_name.setValue("Untitled simulation", false);
        menu_field_button.update("Submit", "fa-arrow-circle-right", submit);

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
            var hh = Math.floor( ticks / 3600);
            var mm = Math.floor( (ticks % 3600) / 60);
            var ss = (ticks % 3600) % 60;

            if(ticks == 3600)   return "1 hour";
            if(ticks == 60)     return "1 minute";
            if(ticks == 1)      return "1 second";
            var time = '';

            if(hh > 0)
                time = hh + " hour" + (hh>1? "s" :"");

            if(mm > 0)
                time += " " + mm + " minute" + (mm>1? "s" :"");

            if(ss > 0)
                time += " " + ss + " second" + (ss>1? "s" :"");

            return time;
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

                    var startHours = result.startTick / 3600;
                    $scope.startTime.setHours(startHours);
                    var startMinutes = (result.startTick - startHours * 3600) / 60;
                    $scope.startTime.setMinutes(startMinutes);

                    var endHours = (result.startTick + result.ticks) / 3600;
                    $scope.endTime.setHours(endHours);
                    var endMinutes = (result.startTick + result.ticks - endHours * 3600) / 60;
                    $scope.endTime.setMinutes(endMinutes);
                }
            });
        }

        // Modals
        this.newProducer = function (title, type) {

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

        this.newConsumer = function (title, type) {

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

        this.newPassengerflow = function(){
            $modal.open({
                templateUrl: 'templates/modals/newPassengerflow.html',
                controller: 'NewPassengerflowModalCtrl',
                size: 'sm'
            }).result.then(function(data) {
                addData(data, 'passengerflow');
            });
        };

        this.openConfigModal = function() {

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
            });
        };

    });

})();