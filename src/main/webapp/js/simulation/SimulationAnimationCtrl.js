(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationAnimationCtrl', function($routeParams, $scope, Simulation, WeightToColor, TicksToTimeService) {
        var ctrl = this;

        ctrl.simulation = {};

        ctrl.totalSteps = 7;
        ctrl.progress = 0;
        ctrl.control = {};

        Simulation.run({}, {id: $routeParams.id, breakpoints: 100}, function(result) {
            console.log(result);
            ctrl.simulation = result;
            ctrl.totalSteps = result.tickBreakpoints;

            update_datasource_progress();
        });

        $scope.$watchCollection(function() { return ctrl.progress; }, update_datasource_progress);
        function update_datasource_progress() {
            _.each(ctrl.simulation.nodes, function (value, key) {
                ctrl.simulation.nodes[key].progress = ctrl.progress;
            });

            ctrl.control.update();
        }

        ctrl.extraTooltip = function(){


            return d3.behavior
                .tooltip()
                .text(function(d){
                    switch (d.type) {
                        case "bus":
                        case "train":
                            return "Brought " + d.nodeDataList[d.progress].entitiesTransfered + " passengers to the location." + "<br/>" +
                            "Number of arrivals: " + d.producerDataList[d.progress].arrivals + "<br/>" +
                                "Number of " + d.type + " in queue: " + d.producerDataList[d.progress].numberOfBusesInQueue;

                        case "passengerflow":
                            return  "Brought " + d.nodeDataList[d.progress].entitiesTransfered + " passengers to the location." + "</br>" +
                                "Number of arrivals: " + d.producerDataList[d.progress].arrivals;

                        case "parking":
                            return "Brought " + d.consumerDataList[d.progress].entitiesConsumed + " passengeres to the location.";

                        case "desktop":
                        case "consumerGroup-desktop":
                        case "consumerGroup-suitcase":
                        case "door":
                        case "suitcase":
                            return "Entities in queue: " + d.consumerDataList[d.progress].entitiesInQueue + "</br>" +
                                    "Waiting time: " + TicksToTimeService.standardTicksToTime(d.consumerDataList[d.progress].maxWaitingTime);

                    }
                });
        };

        ctrl.extraBorder = function() {

            function coloring(d) {
                if(typeof d.consumerDataList !== "undefined" && d.type !== "parking") {
                    var val = d.consumerDataList[d.progress].entitiesInQueue;
                    return WeightToColor.colorFromValue(val);
                }
                if(d.type == "train" || d.type == "bus"){
                    var val = d.producerDataList[d.progress].numberOfBusesInQueue;
                    return WeightToColor.colorFromValue(val*50);
                }
            }

            return d3.behavior.border()
                .width(function(){ return "5px"; })
                .color(coloring);
        };
    });

})();