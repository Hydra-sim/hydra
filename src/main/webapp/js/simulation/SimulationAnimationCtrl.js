(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationAnimationCtrl', function($routeParams, menu_field_button, $scope, Simulation, WeightToColor) {
        this.simulationId = $routeParams.id;
        menu_field_button.reset();

        $scope.datasource = {};
        $scope.image = {};

        Simulation.run({}, {id: $routeParams.id, breakpoints: 100}, function(result) {

            $scope.datasource.nodes = result.nodes;
            $scope.datasource.edges = result.relationships;
            $scope.totalSteps = result.tickBreakpoints -1;
            $scope.image = result.map;
            if(typeof result.map != 'undefined' && result.map != null && typeof result.map.id != 'undefined')
                $scope.image.url = 'api/map/' + result.map.id;

            var startTimeDate = new Date();
            startTimeDate.setHours(0);
            startTimeDate.setMinutes(0);
            startTimeDate.setSeconds(result.startTick);
            $scope.startTime = startTimeDate.toLocaleTimeString();

            var endTimeDate = new Date();
            endTimeDate.setHours(0);
            endTimeDate.setMinutes(0);
            endTimeDate.setSeconds(result.startTick + result.ticks);
            $scope.endTime = endTimeDate.toLocaleTimeString();

            $scope.currentTime.date = startTimeDate;

            $scope.ticksBetweenSteps = result.ticks / result.tickBreakpoints;
            var date = $scope.currentTime.date;
            $scope.currentTime.seconds = date.getHours()*60*60 + date.getMinutes()*60 + date.getSeconds();

            update_datasource_progress();
        });

        $scope.currentTime = {};
        $scope.currentTime.date = new Date();

        $scope.steps = 1;
        $scope.progress = {};
        $scope.progress.position = 0;
        $scope.currentTime = {};
        $scope.totalSteps = 7;
        $scope.control = {};

        function update_datasource_progress() {
            _.each($scope.datasource.nodes, function (value, key, list) {
                $scope.datasource.nodes[key].progress = $scope.progress.position;
            });

            if ($scope.currentTime.date) {

                $scope.currentTime.date.setHours(0);
                $scope.currentTime.date.setMinutes(0);

                $scope.currentTime.date.setSeconds($scope.currentTime.seconds + ( $scope.ticksBetweenSteps * $scope.progress.position ));
            }

        }

        $scope.$watchCollection('progress', function(newvalue) {

            update_datasource_progress();
            $scope.control.update();
        });

        $scope.extraBorder = function() {

            return d3.behavior.border()
                .width(function (d) {
                    return "5px";
                })
                .color(function(d) {
                    if(typeof d.consumerDataList !== "undefined" && d.type !== "parking") {
                        var val = d.consumerDataList[d.progress].entitiesInQueue;
                        return WeightToColor.colorFromValue(val);
                    }
                });
        };
    });

})();