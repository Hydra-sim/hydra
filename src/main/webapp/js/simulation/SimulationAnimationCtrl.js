(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationAnimationCtrl', function($routeParams, menu_field_button, $scope, Simulation, WeightToColor) {
        var ctrl = this;

        menu_field_button.reset();

        ctrl.simulation = {};

        $scope.totalSteps = 7;
        $scope.progress = {
            position: 0
        };
        ctrl.control = {};

        Simulation.run({}, {id: $routeParams.id, breakpoints: 100}, function(result) {

            ctrl.simulation = result;
            $scope.totalSteps = result.tickBreakpoints;
            $scope.image = result.map;

            if(typeof result.map != 'undefined' && result.map != null && typeof result.map.id != 'undefined')
                ctrl.simulation.map.url = 'api/map/' + result.map.id;

            update_datasource_progress();
        });

        ctrl.progressTime = function() {

            var ticksBetweenSteps = ctrl.simulation.ticks / ctrl.simulation.tickBreakpoints;
            return ctrl.simulation.startTick + ticksBetweenSteps * $scope.progress.position;
        };

        function update_datasource_progress() {
            _.each(ctrl.simulation.nodes, function (value, key) {
                ctrl.simulation.nodes[key].progress = $scope.progress.position;
            });
        }

        $scope.$watchCollection('progress', function(newvalue) {
            update_datasource_progress();
            ctrl.control.update();
        });

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