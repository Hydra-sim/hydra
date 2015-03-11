(function() {

    'use strict';

    var app = angular.module('unit.controllers', [
        'ngRoute',
        'services',
        'ui.bootstrap'
    ]);

    app.controller('ApplicationController', ['$scope', '$rootScope', '$location', 'menu_field_name', function($scope, $rootScope, $location, menu_field_name) {
        $rootScope.menu_field_button = "New Simulation";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() {
            $location.path('/newsimulation');
        };

        $rootScope.menu_field_name = menu_field_name;
        menu_field_name.disable();
    }]);

    app.controller('SimulationController', ['$scope', 'Simulation', function ($scope, Simulation) {
        $scope.simulations = Simulation.query({});

        $scope.deleteSimulation = function(id) {

            Simulation.delete({}, {"id": id}, function() {
                $scope.simulations = Simulation.query({});
            });

        };
    }]);

    app.controller('SimulationNew', ['$scope', '$location', '$rootScope', 'Simulation', 'SimResult', 'menu_field_name', '$modal', function ($scope, $location, $rootScope, Simulation, SimResult, menu_field_name, $modal) {
        $scope.timeBetweenBuses = 10;
        $scope.numberOfEntrances = 1;
        $scope.days = 0;
        $scope.hours = 1;
        $scope.minutes = 0;
        $scope.entitesToProduce = 1;
        $scope.entitesConsumedPerTick = 1;
        $scope.consumers = [];
        $scope.producers = [];

        menu_field_name.setValue("Untitled simulation");

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {
            var sim = new Simulation({
                'name': menu_field_name.value,
                'timeBetweenBuses': $scope.timeBetweenBuses,
                'numberOfEntrances': $scope.numberOfEntrances,
                'ticks': $scope.days*24*60 + $scope.hours * 60 + $scope.minutes,
                'entitesToProduce': $scope.entitesToProduce,
                'entitesConsumedPerTick': $scope.entitesConsumedPerTick
            });

            sim.$save().then(function(result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
            });
        };

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.showComplex = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'modalNewController',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.log = function(data) {
            console.log(data);
        };

        $scope.dataset = {
            nodes: [
                {title: "new concept", id: 0, x: 100, y: 100, children: []},
                {title: "new concept", id: 1, x: 100, y: 300, children: []}
            ],
            edges: []
        };

        $scope.dataset.edges.push({source: $scope.dataset.nodes[1], target: $scope.dataset.nodes[0]});
        $scope.dataset.nodes[ 1 ].children.push( 0 );

        $scope.addData = function() {
            $scope.dataset.nodes.push(
                {title: "new concept", id: 0, x: 0, y: 0}
            );
        };
    }]);

    app.controller('SimulationResult', ['$scope', '$rootScope', 'SimResult', function($scope, $rootScope, SimResult) {
        $scope.entitiesConsumed         = SimResult.data.entitiesConsumed;
        $scope.entitiesInQueue          = SimResult.data.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = SimResult.data.maxWaitingTimeInTicks;

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    }]);

    app.controller('SimulationShow', ['$scope', '$rootScope', '$routeParams', 'Simulation', function($scope, $rootScope, $routeParams, Simulation) {
        Simulation.get({}, {"id": $routeParams.id}, function(data) {
            console.log(data);

            $scope.entitiesConsumed         = data.result.entitiesConsumed;
            $scope.entitiesInQueue          = data.result.entitiesInQueue;
            $scope.maxWaitingTimeInTicks    = data.result.maxWaitingTimeInTicks;
        });

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    }]);

    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('ModalDemoCtrl', function ($scope, $modal, $log) {

        $scope.openProducerModal = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'producerModal.html',
                controller: 'ProducerModalInstanceCtrl',
                size: size,
                resolve: {
                    producers: function () {
                        return $scope.producers;
                    }
                }
            });
        };

        $scope.openConsumerModal = function (size) {

            $modal.open({
                templateUrl: 'consumerModal.html',
                controller: 'ConsumerModalInstanceCtrl',
                size: size,
                resolve: {
                    consumers: function () {
                        return $scope.consumers;
                    }
                }
            });
        };
    });

    app.controller('ConsumerModalInstanceCtrl', function ($scope, $modalInstance, $log, consumers) {

        $scope.consumers = consumers;

        $scope.submit = function () {
            $modalInstance.close();

            var consumer = {
                entitesConsumedPerTick: $scope.entitesConsumedPerTick
            };

            $scope.consumers.push( consumer );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('ProducerModalInstanceCtrl', function ($scope, $modalInstance, $log, producers) {

        $scope.producers = producers;

        $scope.submit = function () {
            $modalInstance.close();

            var producer = {
                entitiesToProduce: $scope.entitiesToProduce,
                timetable: {
                    startTickForProducer: $scope.startTickForProducer,
                    timeBetweenBuses: $scope.timeBetweenBuses
                }
            };

            $scope.producers.push( producer );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('TimetableList', function($scope, $rootScope, Timetable) {
        function updateTimetableScope() {
            $scope.timetables = Timetable.query({});
        }
        updateTimetableScope();

        $rootScope.$on('updateTimetable', updateTimetableScope);

        $scope.deleteTimetable = function(id) {
            Timetable.delete({}, {"id": id}, updateTimetableScope);
        };
    });

    app.controller('TimetableNew', function($scope, $rootScope, $modalInstance, Timetable) {
        $scope.arrivals = [
            { time: 0, passengers: 0 }
        ];

        $scope.totalArrivals = 1;
        $scope.name = "";

        $scope.addLine = function() {
            $scope.arrivals.push({ time: 0, passengers: 0 });
            $scope.totalArrivals = $scope.arrivals.length;
        };

        $scope.ok = function () {
            var timetable = new Timetable({
                name: $scope.name,
                arrivals: $scope.arrivals
            });
            timetable.$save().then(function() {
                $rootScope.$emit('updateTimetable');
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('TimetableController', function($scope, $modal) {
         $scope.newTimetable = function() {
             $modal.open({
                 templateUrl: 'templates/timetable/new.html',
                 controller: 'TimetableNew'
             });
         }
    });

})();