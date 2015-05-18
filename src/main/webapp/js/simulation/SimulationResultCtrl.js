(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationResultCtrl', function($location, $routeParams, SimResult, Simulation, cfpLoadingBar, menu_field_name, menu_field_button, TicksToTimeService, WeightToColor) {

        var ctrl = this;

        ctrl.simulation = {
            nodes: [],
            relationships: []
        };

        menu_field_name.readonly = true;

        ctrl.loaded = false;
        cfpLoadingBar.start();

        if(typeof $routeParams.id != "undefined" && $routeParams.id != null)
        {
            // If the promise doesn't exists, reload the data from the api
            Simulation.run({}, {id: $routeParams.id, breakpoints: 0}, init);
        }
        else if(typeof SimResult.data != "undefined" && SimResult.data != null)
        {
            SimResult.data.then(function(result) {
                // The id is not set
                if(typeof $routeParams.id === "undefined") {
                    $location.path("/result/" + result.id);
                    $location.replace();
                }

                SimResult.data = null;
                Simulation.run({}, {id: result.id, breakpoints: 0}, init);
            });
        }
        else {
            console.log("well this is embarrasing, but this else shouldn't have been run, ever.")
        }

        function init(result) {

            ctrl.simulation = result;
            //console.log(result);

            // Close the loading bar
            cfpLoadingBar.complete();
            ctrl.loaded = true;

            if(typeof result.map != 'undefined' && result.map != null && typeof result.map.id != 'undefined')
                ctrl.simulation.map.url = 'api/map/' + result.map.id;
        }

        // Tooltip for resultpage
        ctrl.extraTooltip = function() {

            return d3.behavior
                .tooltip()
                .text(function(d) {
                    switch (d.type) {
                        case "bus":
                        case "train":
                            return d.timetable.name + "<br/>" +
                                "Brought " + d.entitiesTransfered + " passengers to the location." + "<br/>" +
                                "Number of arrivals: " + d.numberOfArrivals + "<br/>" +
                                "Number of "  + d.type + " in queue: " + d.numberOfBusesInQueue;
                        //TODO: Legge number of buses in queue bare på buss


                        case "passengerflow":
                            return "Persons per arrival: " + d.personsPerArrival + "<br/>" +
                                "Time between arrivals: " + TicksToTimeService.standardTicksToTime(d.timeBetweenArrivals) + "<br/>" +
                                "Brought " + d.entitiesTransfered + " passengers to the location.";


                        case "parking":
                            console.log("d:" + d);
                            return "Buses handled every " + TicksToTimeService.standardTicksToTime(d.ticksToConsumeEntity) + "<br/>" +
                                "Brought " + d.entitiesTransfered + " passengeres to the location.";

                        case "desktop":
                        case "consumerGroup-desktop":
                        case "consumerGroup-suitcase":
                        case "door":
                        case "suitcase":
                            var maxWaitingTime;
                            if(d.maxWaitingTimeOnCurrentNode !== 0){
                                maxWaitingTime = TicksToTimeService.standardTicksToTime(d.maxWaitingTimeOnCurrentNode);
                            } else{
                                maxWaitingTime = 0;
                            }
                            var printForConsumer = "Passengers handled every " + TicksToTimeService.standardTicksToTime(d.ticksToConsumeEntity) + "<br/>" +
                                "Passengers that went through: " + d.entitiesConsumed.length + "<br/>" +
                                "Max waiting time: " + maxWaitingTime;
                            if(d.type.indexOf("consumerGroup") != -1) {
                                printForConsumer += "<br/>" + "Passengers in queue at simulation end: " + d.numberOfConsumersInQueue +
                                "<br/>" + "Quantity: " + d.consumers.length + "</br>";
                            }else{
                                printForConsumer += "<br/>" + "Passengers in queue at simulation end: " + d.entitiesInQueue.length;
                            }
                            return printForConsumer;

                        default:
                            return d.weight + "%";

                    }
                });
        };


        ctrl.extraBorder = function() {

            return d3.behavior.border()
                .color(function (d) {
                    if(typeof d.entitiesInQueue !== "undefined" && d.type !== "parking") {
                        if(d.type == "consumerGroup-desktop" || d.type == "consumerGroup-suitcase"){
                            return WeightToColor.colorFromValue(d.numberOfConsumersInQueue);
                        } else{
                            return WeightToColor.colorFromValue(d.entitiesInQueue.length);
                        }
                    }
                    if(typeof d.numberOfBusesInQueue !== "undefined" ){
                        return WeightToColor.colorFromValue(d.numberOfBusesInQueue * 50);
                    }
                })
                .width(function (d) {
                    return "5px";
                });
        };

        menu_field_button.reset();
    });

})();