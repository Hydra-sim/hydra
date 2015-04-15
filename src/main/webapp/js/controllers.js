(function() {

    'use strict';

    var app = angular.module('unit.controllers', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'angularFileUpload'
    ]);

    app.controller('ApplicationCtrl', function($scope, $rootScope, $location, menu_field_name) {

        $rootScope.menu_field_button = "New Simulation";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() {
            $location.path('/simulation/new');
        };

        $rootScope.menu_field_name = menu_field_name;
        menu_field_name.disable();
    });

    app.controller("TabCtrl", function($scope, $rootScope, $location) {

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

    app.controller('UploadMapCtrl', function($scope, $rootScope, $log, Map){

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

    app.controller("CollapseCtrl", function($scope){
        $scope.isCollapsed = true;

    });


    app.controller('PasswordInstanceCtrl', function($scope, $modalInstance, $location, Authentication, $log, $resource, $http, id) {

        $scope.id = id;

        $scope.wrongPassword = false;

        $scope.submitPassword = function(input){


            var auth = new Authentication({
                'input': input
            });

            auth.$save().then(function(result) {

                //$location.path('/result');
                //$location.replace();

                $log.info(result.input);
            });


            //$location.path('/simulation/' + id);
            //$location.replace();

            // Resource.action([parameters], postData, [success], [error])

            /*
             var Auth = $resource('api/auth', {}, {

             auth: {method: 'POST'}
             });

             $log.info(Auth.auth({}, {password: password}));
             */

            /*
             $http.post('/api/auth', {"password": password})
             .success(function(data, status, headers, config) {
             $log.info(data);
             if(data == "123") {
             //$location.path('/simulation/' + id);
             $modalInstance.close();
             } else {
             $scope.wrongPassword = true;
             }
             }
             );*/
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });



    /**
     * WHY DO I GET AN ERROR IF I MOVE THIS INTO simulation/controllers.js????
     */
    app.controller('SimulationNewCtrl', function ($scope, $location, $rootScope, $modal, $log, Simulation, SimResult, menu_field_name) {

        $scope.updateTicks = function() {

            $scope.startTick = ($scope.startTime.getHours() * 60  * 60) + ($scope.startTime.getMinutes() * 60);
            $scope.ticks = ($scope.endTime.getHours() * 60 * 60) + ($scope.endTime.getMinutes() * 60) - $scope.startTick;
        };

        //Default values
        $scope.startTime = new Date();
        $scope.startTime.setHours(6);
        $scope.startTime.setMinutes(0);

        $scope.endTime = new Date();
        $scope.endTime.setHours(8);
        $scope.endTime.setMinutes(0);

        $scope.updateTicks();

        $scope.ticksToConsumeEntitiesList = [];
        $scope.timetableIds = [];

        $scope.consumerGroupNames = [];
        $scope.numberOfConsumersInGroups = [];
        $scope.ticksToConsumeEntitiesGroups = [];

        $scope.totalNumberOfEntititesList = [];
        $scope.numberOfEntitiesList = [];
        $scope.timeBetweenArrivalsList = [];


        // For dropdown in add consumer/passengerflow
        $scope.options = [];

        menu_field_name.setValue("Untitled simulation");

        $rootScope.menu_field_button = "Submit";
        $rootScope.menu_field_button_icon = "fa-arrow-circle-right";
        $rootScope.menu_field_button_click = function() {

            $scope.updateTicks();

            var sim = new Simulation({
                'name':                             menu_field_name.value,
                'ticks':                            $scope.ticks,
                'ticksToConsumeEntitiesList' :      $scope.ticksToConsumeEntitiesList,
                'timetableIds' :                    $scope.timetableIds,
                'consumerGroupNames' :              $scope.consumerGroupNames,
                'numberOfConsumersInGroups' :       $scope.numberOfConsumersInGroups,
                'ticksToConsumeEntitiesGroups' :    $scope.ticksToConsumeEntitiesGroups,
                'totalNumberOfEntititesList':       $scope.totalNumberOfEntititesList,
                'numberOfEntitiesList':             $scope.numberOfEntitiesList,
                'timeBetweenArrivalsList':          $scope.timeBetweenArrivalsList
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

            console.log(id);

            $scope.dataset.nodes.push(
                {type: "consumer", id: id, x: 400, y: 100}
            );
        };

        $scope.newProducer = function (type) {

            $modal.open({
                templateUrl: 'templates/modals/newProducer.html',
                controller: 'NewProducerInstanceCtrl',
                size: 'sm',
                resolve: {
                    timetableIds: function () {
                        return $scope.timetableIds;
                    },
                    type: function () {
                        return type;
                    }
                }
            });
        };

        $scope.newConsumer = function (type) {

            $modal.open({
                templateUrl: 'templates/modals/newConsumer.html',
                controller: 'NewConsumerInstanceCtrl',
                size: 'sm',
                resolve: {

                    //  ticksToConsumeEntitiesList, type, timeSelectConsumer
                    ticksToConsumeEntitiesList: function () {
                        return $scope.ticksToConsumeEntitiesList;
                    },
                    type: function(){
                        $scope.type = type;
                        return $scope.type;
                    }
                }
            });
        };

        $scope.newConsumerGroup = function() {

            $modal.open({
                templateUrl: 'templates/modals/newConsumerGroup.html',
                controller: 'ConsumerGroupInstanceCtrl',
                size: 'sm',
                resolve: {
                    consumerGroupNames: function () {
                        return $scope.consumerGroupNames;
                    },
                    numberOfConsumersInGroups: function () {
                        return $scope.numberOfConsumersInGroups;
                    },
                    ticksToConsumeEntitiesGroups: function() {
                        return $scope.ticksToConsumeEntitiesGroups;
                    }
                }

            });
        };

        $scope.newPassengerflow = function(){
            $modal.open({
                templateUrl: 'templates/modals/newPassengerflow.html',
                controller: 'NewPassengerflowInstanceCtrl',
                size: 'sm',
                resolve: {
                    totalNumberOfEntititesList: function(){
                        return $scope.totalNumberOfEntititesList;
                    },
                    numberOfEntitiesList: function(){
                        return $scope.numberOfEntitiesList;
                    },
                    timeBetweenArrivalsList: function(){
                        return $scope.timeBetweenArrivalsList;
                    }
                }
            });
        };

        $scope.openConfigModal = function() {

            var configModal = $modal.open({
                templateUrl: 'templates/modals/configModal.html',
                controller: 'ConfigModalInstanceCtrl',
                resolve: {
                    startTime: function() {
                        return $scope.startTime;
                    },
                    endTime: function() {
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

        $scope.choosePreset = function(){
            $modal.open({
                templateUrl: 'templates/modals/choosePreset.html',
                controller:  'ChoosePresetInstanceCtrl',
                size: 'sm'
            });
        };
    });

    /**
     * WHY DO I GET AN ERROR IF I MOVE THIS INTO simulation/controllers.js????
     */
    app.controller('SimulationListCtrl', function ($scope, Simulation, $location, $modal) {
        $scope.simulations = Simulation.query({});

        $scope.deleteSimulation = function(id) {

            Simulation.delete({}, {"id": id}, function() {
                $scope.simulations = Simulation.query({});
            });

        };

        $scope.editSimulation = function(id, size) {

            $modal.open({
                templateUrl: 'passwordAuth.html',
                controller: 'PasswordInstanceCtrl',
                size: size,
                resolve: {
                    id: function() {
                        return id;
                    }
                }
            });
        };
    });

    app.controller('NewConsumerInstanceCtrl', function($scope, $modalInstance, $log, ticksToConsumeEntitiesList, type){

        $scope.ticksToConsumeEntitiesList = ticksToConsumeEntitiesList;
        $scope.modalTitle = type;
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitConsumer = function(amountOfTime, timeSelectConsumer){

            $log.info(amountOfTime);
            $log.info(timeSelectConsumer.item.label);

            var ticksToConsumeEntities = amountOfTime; // Seconds by default


            if(timeSelectConsumer.item.label == "Minutes") { // Minutes

                ticksToConsumeEntities *= 60;

            } else if(timeSelectConsumer.item.label == "Hours") { // Hours

                ticksToConsumeEntities *= 60 * 60;
            }


            $scope.ticksToConsumeEntitiesList.push(ticksToConsumeEntities);

            $modalInstance.close();
        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('NewProducerInstanceCtrl', function($scope, $modalInstance, Timetable, timetableIds, $log, type){

        $scope.timetableIds = timetableIds;
        $scope.modalTitle = type;

        function updateTimetableScope() {
            $scope.timetables = Timetable.query({});
        }
        updateTimetableScope();

        $scope.submitProducer = function(selectedItem){

            /*Lage funksjon som finner og returnerer aktiv tidstabell id så pushe den inn i $scope.timetableIds liste*/

            $log.info(selectedItem);
            timetableIds.push(selectedItem);


            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });

    app.controller("NewPassengerflowInstanceCtrl", function($scope, $modal, $modalInstance, $log, totalNumberOfEntititesList, numberOfEntitiesList, timeBetweenArrivalsList){
        $scope.totalNumberOfEntititesList = totalNumberOfEntititesList;
        $scope.numberOfEntitiesList = numberOfEntitiesList;
        $scope.timeBetweenArrivalsList = timeBetweenArrivalsList;

        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitPassengerflow =  function(totalNumberOfEntities, numberOfEntities, timeBetweenArrivals , timeSelect){


            $scope.totalNumberOfEntititesList.push(totalNumberOfEntities);
            $scope.numberOfEntitiesList.push(numberOfEntities);



            if(timeSelect.item.label == "Minutes"){
                timeBetweenArrivals *= 60;
            }
            else if(timeSelect.item.label == "Hours"){
                timeBetweenArrivals *= 60 * 60;
            }

            $scope.timeBetweenArrivalsList.push(timeBetweenArrivals);

            $modalInstance.close();
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

    });
})();