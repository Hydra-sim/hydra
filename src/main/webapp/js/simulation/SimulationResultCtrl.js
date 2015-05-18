(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationResultCtrl', function($location, $routeParams, SimResult, Simulation, cfpLoadingBar, menu_field_name, menu_field_button, TicksToTimeService) {

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
            console.log(result);

            // Close the loading bar
            cfpLoadingBar.complete();
            ctrl.loaded = true;

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

            function hsv2rgb(h, s, v) {
                // adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
                var rgb, i, data = [];
                if (s === 0) {
                    rgb = [v,v,v];
                } else {
                    h = h / 60;
                    i = Math.floor(h);
                    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
                    switch(i) {
                        case 0:
                            rgb = [v, data[2], data[0]];
                            break;
                        case 1:
                            rgb = [data[1], v, data[0]];
                            break;
                        case 2:
                            rgb = [data[0], v, data[2]];
                            break;
                        case 3:
                            rgb = [data[0], data[1], v];
                            break;
                        case 4:
                            rgb = [data[2], data[0], v];
                            break;
                        default:
                            rgb = [v, data[0], data[1]];
                            break;
                    }
                }
                return '#' + rgb.map(function(x){
                        return ("0" + Math.round(x*255).toString(16)).slice(-2);
                    }).join('');
            }

            function colorFromValue(val){
                if(val > 100){
                    val = 100;
                }
                var h = Math.floor((100 - val) * 120 / 100);
                var s = Math.abs(val - 50) / 50;

                return hsv2rgb(h, s, 1);
            }

            return d3.behavior.border()
                .color(function (d) {
                    if(typeof d.entitiesInQueue !== "undefined" && d.type !== "parking") {
                        if(d.type == "consumerGroup-desktop" || d.type == "consumerGroup-suitcase"){
                            return colorFromValue(d.numberOfConsumersInQueue);
                        } else{
                            return colorFromValue(d.entitiesInQueue.length);
                        }
                    }
                    if(typeof d.numberOfBusesInQueue !== "undefined" ){
                        return colorFromValue(d.numberOfBusesInQueue * 50);
                    }
                })
                .width(function (d) {
                    return "5px";
                });
        };

        menu_field_button.reset();
    });

})();