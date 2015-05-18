(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationNewCtrl', function ($location, $modal, $routeParams, $rootScope, SimResult, Simulation, Timetable, menu_field_name, menu_field_button, Upload, TicksToTimeService) {

        var that = this;

        //Scope values
        this.startTime = new Date();
        this.startTime.setHours(6);
        this.startTime.setMinutes(0);

        this.endTime = new Date();
        this.endTime.setHours(8);
        this.endTime.setMinutes(0);

        this.control = {};
        this.dataset = { nodes: [], edges: [] };

        // Help methods
        this.debug = debug;
        function debug() {
            console.log("this.dataset", that.dataset);
        }

        function submit() {
            var startTick =
                that.startTime.getHours() * 3600 +
                that.startTime.getMinutes() * 60;

            var ticks =
                that.endTime.getHours() * 3600 +
                that.endTime.getMinutes() * 60
                -startTick;

            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            ticks,
                'startTick':                        startTick ,
                'nodes':                            that.dataset.nodes,
                'edges':                            that.dataset.edges,
                'mapId':                            that.image.id
            });

            SimResult.data = sim.$save();
            $location.path('/result');
            $location.replace();
        }

        function addData(data, type) {
            var pos = that.control.getlastpos();
            that.control.addNode(type || "consumer", pos.x, pos.y, data);
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

        // Tooltip
        this.extraTooltip = function() {
            var timetable = Timetable.query({});

            function text(d) {
                if(d.type == "bus" || d.type == "train") {
                    return _.find(timetable, function(t) { return t.id == d.timetableId; }).name;
                }
                else if(d.type == "passengerflow")
                {
                    return "Persons per arrival: " + d.personsPerArrival + "<br/>" +
                           "Time between arrivals: " + TicksToTimeService.standardTicksToTime(d.timeBetweenArrivals);
                }
                else if(d.type == "parking")
                {
                    return "Buses handled every " + TicksToTimeService.standardTicksToTime(d.ticksToConsumeEntity);
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
                    var printForConsumer =  "Passengers handled every " + TicksToTimeService.standardTicksToTime(d.ticksToConsumeEntity);

                    if(d.type.indexOf("consumerGroup") != -1) {
                        printForConsumer += "<br/>" + "Quantity: " + d.consumers.length;
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

                    menu_field_name.setValue(result.name, false);

                    that.dataset.nodes = result.nodes;
                    that.dataset.edges = result.relationships;

                    var startHours = result.startTick / 3600;
                    that.startTime.setHours(startHours);
                    var startMinutes = (result.startTick - startHours * 3600) / 60;
                    that.startTime.setMinutes(startMinutes);

                    var endHours = (result.startTick + result.ticks) / 3600;
                    that.endTime.setHours(endHours);
                    var endMinutes = (result.startTick + result.ticks - endHours * 3600) / 60;
                    that.endTime.setMinutes(endMinutes);
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
                        return that.startTime;
                    },
                    endTime: function() {
                        return that.endTime;
                    }
                }
            });

            configModal.result.then(function (time) {
                that.startTime = time.startTime;
                that.endTime = time.endTime;
            });
        };

    });

})();