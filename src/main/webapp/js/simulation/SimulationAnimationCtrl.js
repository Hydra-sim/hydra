(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationAnimationCtrl', function($routeParams, menu_field_button, $scope, Simulation, WeightToColor) {
        var ctrl = this;

        menu_field_button.reset();

        $scope.datasource = {};
        $scope.image = {};

        $scope.currentTime = {};

        $scope.progress = {
            position: 0
        };
        $scope.totalSteps = 7;
        ctrl.control = {};

        Simulation.run({}, {id: $routeParams.id, breakpoints: 100}, function(result) {

            $scope.datasource = result;
            $scope.totalSteps = result.tickBreakpoints;
            $scope.image = result.map;

            if(typeof result.map != 'undefined' && result.map != null && typeof result.map.id != 'undefined')
                $scope.image.url = 'api/map/' + result.map.id;

            $scope.currentTime.date = new Date();
            $scope.currentTime.date.setHours(0);
            $scope.currentTime.date.setMinutes(0);
            $scope.currentTime.date.setSeconds(result.startTick);

            $scope.ticksBetweenSteps = result.ticks / result.tickBreakpoints;

            update_datasource_progress();
        });

        function update_datasource_progress() {
            _.each($scope.datasource.nodes, function (value, key) {
                $scope.datasource.nodes[key].progress = $scope.progress.position;
            });

            var date = $scope.currentTime.date;
            if (date) {
                var seconds = $scope.datasource.startTick + $scope.ticksBetweenSteps * $scope.progress.position;

                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(seconds);
            }
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