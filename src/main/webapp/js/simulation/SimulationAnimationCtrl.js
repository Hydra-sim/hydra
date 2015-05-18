(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationAnimationCtrl', function($routeParams, menu_field_button, $scope, $interval, Simulation) {
        this.simulationId = $routeParams.id;
        menu_field_button.reset();

        $scope.datasource = {};
        $scope.image = {};

        Simulation.run({}, {id: $routeParams.id, breakpoints: 100}, function(result) {

            $scope.datasource.nodes = result.nodes;
            $scope.datasource.edges = result.relationships;
            $scope.totalSteps = result.tickBreakpoints -1;
            //$scope.image = result.map;
            //$scope.image.url = 'api/map/' + result.map.id;

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
                .width(function (d) {
                    return "5px";
                })
                .color(function(d) {
                    if(typeof d.consumerDataList !== "undefined" && d.type !== "parking") {
                        var val = d.consumerDataList[d.progress].entitiesInQueue;
                        return colorFromValue(val);
                    }
                });
        };
    });

})();