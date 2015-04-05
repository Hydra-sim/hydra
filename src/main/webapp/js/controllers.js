(function() {

    'use strict';

    var app = angular.module('unit.controllers', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'angularFileUpload'
    ]);

    app.controller('ApplicationController', function($scope, $rootScope, $location, menu_field_name) {

        $rootScope.menu_field_button = "New Simulation";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() {
            $location.path('/simulation/new');
        };

        $rootScope.menu_field_name = menu_field_name;
        menu_field_name.disable();
    });

    app.controller('SimulationController', function ($scope, Simulation, $location) {
        $scope.simulations = Simulation.query({});

        $scope.deleteSimulation = function(id) {

            Simulation.delete({}, {"id": id}, function() {
                $scope.simulations = Simulation.query({});
            });

        };

        $scope.editSimulation = function(id) {
            $location.path('/simulation/' + id);
        };
    });

    app.controller('SimulationNew', function ($scope, $location, $rootScope, $modal, Simulation, SimResult, menu_field_name) {
        //Default values
        $scope.ticks = 60;
        $scope.ticksToConsumeEntitiesList = [];
        $scope.timetableIds = [];

        menu_field_name.setValue("Untitled simulation");

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {
            var sim = new Simulation({
                'name': menu_field_name.value,
                'ticks': $scope.ticks,
                'ticksToConsumeEntitiesList' : $scope.ticksToConsumeEntitiesList,
                'timetableIds' : $scope.timetableIds
            });

            sim.$save().then(function(result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
            });
        };

        $scope.dataset = {
            nodes: [
                {type: "producer", id: 0, x: 100, y: 100},
                {type: "producer", id: 1, x: 100, y: 300},
                {type: "consumer", id: 2, x: 300, y: 300}
            ],
            edges: [
                {source: 1, target: 0}
            ]
        };

        $scope.addData = function() {
            var id = _.max($scope.dataset.nodes, function(node) { return node.id; }).id + 1;
            $scope.dataset.nodes.push(
                {type: "consumer", id: id, x: 400, y: 100}
            );
        };

        $scope.newProducer = function (size) {

            $modal.open({
                templateUrl: 'newProducer.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    ticksToConsumeEntitiesList: function () {
                        return $scope.ticksToConsumeEntitiesList;
                    },
                    timetableIds: function () {
                        return $scope.timetableIds;
                    }
                }
            });
        };

        $scope.newConsumer = function (size) {

            $modal.open({
                templateUrl: 'newConsumer.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    ticksToConsumeEntitiesList: function () {
                        return $scope.ticksToConsumeEntitiesList;
                    },
                    timetableIds: function () {
                        return $scope.timetableIds;
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

        $scope.choosePreset = function(size){
                $modal.open({
                templateUrl: 'choosePreset.html',
                size: size
            });
        }

    });

    app.controller('SimulationEdit', function ($log, $scope, $routeParams, $rootScope, $location, Simulation, SimResult,
                                               menu_field_name) {

        Simulation.get({}, {"id": $routeParams.id}, function(result) {
            $scope.id = result.id;

            menu_field_name.setValue(result.name);

            $scope.ticks = result.ticks;

            $scope.ticksToConsumeEntitiesList = [];

            for(var i = 0; i < result.consumers.length; i++) {
                $scope.ticksToConsumeEntitiesList.push (result.consumers[i].ticksToConsumeEntities);
            }

            $scope.timetableIds = [];

            for(var i = 0; i < result.producers.length; i++) {
                $scope.timetableIds.push(result.producers[i].timetable.id);
            }
        });

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {
            var sim = new Simulation({
                'name': menu_field_name.value,
                'ticks': $scope.ticks,

                'ticksToConsumeEntitiesList' : $scope.ticksToConsumeEntitiesList,
                'timetableIds' : $scope.timetableIds
            });

            sim.$save().then(function(result) {
                $location.path('/result');
                $location.replace();

                SimResult.data = result;
            });
        };
    });
    app.controller('SimulationResult', function($scope, $rootScope, SimResult) {
        $scope.entitiesConsumed         = SimResult.data.entitiesConsumed;
        $scope.entitiesInQueue          = SimResult.data.entitiesInQueue;
        $scope.maxWaitingTimeInTicks    = SimResult.data.maxWaitingTimeInTicks;

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    });

    app.controller('SimulationShow', function($scope, $rootScope, $routeParams, Simulation) {
        Simulation.get({}, {"id": $routeParams.id}, function(data) {
            console.log(data);

            $scope.entitiesConsumed         = data.result.entitiesConsumed;
            $scope.entitiesInQueue          = data.result.entitiesInQueue;
            $scope.maxWaitingTimeInTicks    = data.result.maxWaitingTimeInTicks;
        });

        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function() {};
    });

    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $log, ticksToConsumeEntitiesList,
                                                  Timetable, timetableIds) {

        $scope.ticksToConsumeEntitiesList = ticksToConsumeEntitiesList;

        $scope.submitConsumer = function (ticksToConsumeEntities) {

            $scope.ticksToConsumeEntitiesList.push( ticksToConsumeEntities );

            $modalInstance.close();
        };

        $scope.timetableIds = timetableIds;

        function updateTimetableScope() {
            $scope.timetables = Timetable.query({});
        }
        updateTimetableScope();

        $scope.submitProducer = function () {

            $scope.active = function() {
                return $scope.timetables.filter(function(timetable){
                    return timetable;
                })[0];



            };
            $scope.timetableIds.push( $scope.active().id );
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

    app.controller('presetModalInstanceCtrl', function(){

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

        $scope.name = "";

        $scope.addLine = function() {
            $scope.arrivals.push({ time: 0, passengers: 0 });
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

    app.controller('TimetableEdit', function($scope, $routeParams, $rootScope, $location, Timetable) {
        Timetable.get({}, {"id": $routeParams.id}, function(result) {
            $scope.id = result.id;
            $scope.arrivals = result.arrivals;
            $scope.totalArrivals = result.arrivals.length;
            $scope.name = result.name;
        });

        $scope.addLine = function() {
            $scope.arrivals.push({ time: 0, passengers: 0 });
            $scope.totalArrivals = $scope.arrivals.length;
        };

        $scope.ok = function () {
            var timetable = new Timetable({
                id: $scope.id,
                name: $scope.name,
                arrivals: $scope.arrivals
            });
            Timetable.update({"id": $scope.id}, timetable).$promise.then(function() {
                $rootScope.$emit('updateTimetable');
                $location.path('/timetable');
            });
        };

        $scope.cancel = function () {
            $location.path('/timetable');
        };
    });

    app.controller('TimetableController', function($scope, $modal, $rootScope) {
        $rootScope.menu_field_button = "New Timetable";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() {
            $modal.open({
                templateUrl: 'templates/timetable/new.html',
                controller: 'TimetableNew'
            });
        };
    });

    app.controller('PresetController', function($scope, $rootScope) {
        $rootScope.menu_field_button = "New Preset";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() { alert("Not implemented"); };
    });

    app.controller('PresetList', function($scope, $rootScope, Preset) {
        function updatePresetScope() {
            $scope.presets = Preset.query({});
        }
        updatePresetScope();

        $scope.deletePreset = function(id) {
            Preset.delete({}, {"id": id}, updatePresetScope);
        };
    });

    app.controller("tabController", function($scope, $rootScope, $location) {

        $scope.tabs = [
            {name: "SIMULATIONS", link: "/"},
            {name: "TIMETABLES", link: "/timetable"},
            {name: "PRESETS", link: "/preset"},
        ];

        $scope.select= function(item) {
            $location.path(item.link);
            $location.replace();
        };

        $scope.itemClass = function(item) {
            return item.link == $location.path() ? 'active' : '';
        };
    });

    app.controller('UploadMap', function($scope, $rootScope, $log, Map){

        $scope.image = { visible: true, id: 86, exists: true, zoom: 0};
        $scope.image2 = {scale: 1, zoom: 0};

        $scope.toggleImage = function() {
            $scope.image.visible = !$scope.image.visible;
        };

        $scope.deleteImage = function(id) {
            $scope.image.visible = $scope.image.exists = false;
            Map.delete({}, {"id" : id});
        };

        // Create a variable to store the transform value
        $scope.transform = "scale(" + $scope.image.zoom + ")";
        // When the number changes, update the transform string
        $scope.$watch("image.zoom", function() {
            $scope.image.scale = ($scope.image.zoom / 50) + 1;
            $scope.transform = "scale("+$scope.image.scale+")";
        });

        $scope.$watch("image2.scale", function() {
            $scope.transform = "scale("+$scope.image2.scale+")";
        });

    });

    app.controller('MyUploadCtrl', function($scope, $upload, $log, Map) {

        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    /*
                    $upload.upload({
                        url: 'api/map/upload',
                        fields: {'username': $scope.username},
                        file: file
                    });
                    */

                    var map = new Map();
                    map.$save();
                        /*.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        $log.info(data);
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    });*/
                }
            }
        };
    });

    app.controller('MapModalCtrl', function($scope, $modal) {

        $scope.openMapModal = function(size) {

            $modal.open({
                templateUrl: 'mapModal.html',
                controller: 'MapModalInstanceCtrl',
                size: size,
                resolve: {
                    image: function () {
                        return $scope.image;
                    },
                    image2: function() {
                        return $scope.image2;
                    }
                }
            });
        }
    });

    app.controller('MapModalInstanceCtrl', function($scope, $log, $modalInstance, $timeout, image, image2) {

        $scope.image = image;
        $scope.image2 = image2;
        $scope.image.scale = $scope.image2.scale;
        $scope.image.zoom = $scope.image2.zoom;

        $scope.submitMap = function() {
            $scope.image2.scale = $scope.image.scale;
            $scope.image2.zoom = $scope.image.zoom;

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });

    app.controller("collapseController", function($scope){
        $scope.isCollapsed = true;

    });

    app.controller("radialMenuController", function($scope, $rootScope, $location, $modal){

        var items = document.querySelectorAll('.outer-circle .circle');

        for(var i = 0, l = items.length; i < l; i++) {
            items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";

            switch (items[i]){
                case 3:
                    $scope.modalTitle = "NEW TRAIN";
                    break;
            }


        }

        document.querySelector('.menu-button').onclick = function(e) {
            e.preventDefault(); document.querySelector('.outer-circle').classList.toggle('open');
        }

    });


})();