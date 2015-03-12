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
        //Default values
        $scope.days = 0;
        $scope.hours = 0;
        $scope.minutes = 0;

        $scope.ticks = 60;

        $scope.entitiesConsumedPerTickList = [];
        $scope.entitiesToProduceList = [];
        $scope.startTickForProducerList = [];
        $scope.timeBetweenBusesList = [];


        menu_field_name.setValue("Untitled simulation");

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {
            var sim = new Simulation({
                'name': menu_field_name.value,
                'ticks': $scope.ticks,

                'entitiesConsumedPerTickList' : $scope.entitiesConsumedPerTickList,
                'entitiesToProduceList' : $scope.entitiesToProduceList,
                'startTickForProducerList' : $scope.startTickForProducerList,
                'timeBetweenBusesList' : $scope.timeBetweenBusesList

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

    app.controller('ModalCtrl', function ($scope, $modal, $log) {

        $scope.openModal = function (size) {

            $modal.open({
                templateUrl: 'modal.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    entitiesConsumedPerTickList: function () {
                        return $scope.entitiesConsumedPerTickList;
                    }
                    ,
                    entitiesToProduceList: function () {
                        return $scope.entitiesToProduceList;
                    },
                    startTickForProducerList: function () {
                        return $scope.startTickForProducerList;
                    },
                    timeBetweenBusesList: function () {
                        return $scope.timeBetweenBusesList;
                    }
                }
            });
        };

        $scope.openConfigModal = function(size) {

            var configModal = $modal.open({
                templateUrl: 'configModal.html',
                controller: 'ConfigModalInstanceCtrl',
                size: size
            });

            configModal.result.then(function (ticks) {
                $scope.ticks = ticks;
            });
        }
    });

    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $log, entitiesConsumedPerTickList,
                                                  entitiesToProduceList, startTickForProducerList, timeBetweenBusesList) {

        $scope.entitiesConsumedPerTickList = entitiesConsumedPerTickList;

        $scope.submitConsumer = function (entitiesConsumedPerTick) {

            $scope.entitiesConsumedPerTickList.push( entitiesConsumedPerTick );

            $modalInstance.close();
        };


        $scope.entitiesToProduceList = entitiesToProduceList;
        $scope.startTickForProducerList = startTickForProducerList;
        $scope.timeBetweenBusesList = timeBetweenBusesList;

        $scope.submitProducer = function (entitiesToProduce, startTickForProducer, timeBetweenBuses) {

            $scope.entitiesToProduceList.push( entitiesToProduce );
            $scope.startTickForProducerList.push( startTickForProducer );
            $scope.timeBetweenBusesList.push( timeBetweenBuses );


            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('ConfigModalInstanceCtrl', function ($scope, $modalInstance, $log) {
        $scope.days = 0;
        $scope.hours = 1;
        $scope.minutes = 0;

        $scope.submitConfig = function (days, hours, minutes) {
            var ticks = ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
            $modalInstance.close(ticks);
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