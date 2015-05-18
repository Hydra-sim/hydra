(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationAnimationCtrl', function($routeParams, menu_field_button, $scope, Simulation, WeightToColor) {
        var ctrl = this;

        menu_field_button.reset();

        ctrl.simulation = {};

        ctrl.totalSteps = 7;
        ctrl.progress = 0;
        ctrl.control = {};

        Simulation.run({}, {id: $routeParams.id, breakpoints: 100}, function(result) {

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

        ctrl.extraBorder = function() {

            function coloring(d) {
                if(typeof d.consumerDataList !== "undefined" && d.type !== "parking") {
                    var val = d.consumerDataList[d.progress].entitiesInQueue;
                    return WeightToColor.colorFromValue(val);
                }
            }

            return d3.behavior.border()
                .width(function(){ return "5px"; })
                .color(coloring);
        };
    });

})();