(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationEditCtrl', function ($scope, $routeParams, $rootScope, $location, $modal, Simulation, SimResult, menu_field_name, menu_field_button) {

        $scope.dataset = {nodes: [], edges: []};

        $scope.control = {};
        $scope.addData = addData;

        //Default values
        $scope.startTime = new Date();
        $scope.endTime = new Date();

        $scope.updateTicks = function () {

            $scope.startTick = ($scope.startTime.getHours() * 60 * 60) + ($scope.startTime.getMinutes() * 60);
            $scope.ticks = ($scope.endTime.getHours() * 60 * 60) + ($scope.endTime.getMinutes() * 60) - $scope.startTick;
        };

        $scope.updateTime = function (result) {

            var hours = result.startTick / 60 / 60;
            $scope.startTime.setHours(hours);

            var minutes = (result.startTick - (hours * 60 * 60)) / 60;
            $scope.startTime.setMinutes(minutes);

            var hours = (result.startTick + result.ticks) / 60 / 60;
            $scope.endTime.setHours(hours);

            var minutes = ((result.startTick + result.ticks) - (hours * 60 * 60)) / 60;
            $scope.endTime.setMinutes(minutes);
        };

        function addData(data, type) {

            var pos = $scope.control.getlastpos();
            $scope.control.addNode(type || "consumer", pos.x, pos.y, data);
        }

        $scope.submit = function () {

            $scope.updateTicks();

            var sim = new Simulation({
                'name': menu_field_name.value,
                'ticks': $scope.ticks,
                'startTick': $scope.startTick,
                'nodes': $scope.dataset.nodes,
                'edges': $scope.dataset.edges
            });

            $modal.open({

                templateUrl: 'templates/modals/saveAs.html',
                controller: 'SaveAsModalCtrl',
                size: 'sm',
                resolve: {
                    simulationName: function () {
                        return menu_field_name.value;
                    }
                }

            }).result.then(function (data) {

                    console.log(data);
                    SimResult.data = sim.$save();
                    $location.path('/result');
                    $location.replace();
                });
        };

        menu_field_button.value = "Submit";
        menu_field_button.icon = "fa-arrow-circle-right";
        menu_field_button.click = function () {
            var sim = new Simulation({
                'name': menu_field_name.value,
                'ticks': $scope.ticks,
                'ticksToConsumeEntitiesList': $scope.ticksToConsumeEntitiesList,
                'timetableIds': $scope.timetableIds
            });

            sim.$save().then(function (result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
            });
        };

        Simulation.get({}, {"id": $routeParams.id}, function (result) {

            var simAuth = false;

            console.log(result);

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

                $scope.updateTime(result);

                for (var node in $scope.dataset.nodes) {

                    addData(node, node.type);
                }
            }
        });

        $scope.debug = function () {
            console.log("dataset: ", $scope.dataset);
        };

        $scope.newProducer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newProducer.html',
                controller: 'NewProducerModalCtrl',
                size: 'sm',
                resolve: {
                    timetableIds: function () {
                        return $scope.timetableIds;
                    },
                    type: function () {
                        return title;
                    }
                }
            }).result.then(function (data) {
                    addData(data, type)
                });
        };

        $scope.newConsumer = function (title, type) {

            $modal.open({
                templateUrl: 'templates/modals/newConsumer.html',
                controller: 'NewConsumerModalCtrl',
                size: 'sm',
                resolve: {
                    type: function () {
                        return title;
                    }
                }
            }).result.then(function (data) {

                    if (data.hasOwnProperty('numberOfConsumers')) {

                        type = 'consumerGroup-' + type;

                    }

                    addData(data, type)
                });
        };

        $scope.newPassengerflow = function () {
            $modal.open({
                templateUrl: 'templates/modals/newPassengerflow.html',
                controller: 'NewPassengerflowModalCtrl',
                size: 'sm'
            }).result.then(function (data) {
                    addData(data, 'passengerflow');
                });
        };

        $scope.openConfigModal = function () {

            var configModal = $modal.open({
                templateUrl: 'templates/modals/configModal.html',
                controller: 'ConfigModalModalCtrl',
                size: 'sm',
                resolve: {
                    startTime: function () {
                        return $scope.startTime;
                    },
                    endTime: function () {
                        return $scope.endTime;
                    }
                }
            });

            configModal.result.then(function (time) {
                $scope.startTime = time.startTime;
                $scope.endTime = time.endTime;
                $scope.updateTicks();
            });
        };
    });

})();