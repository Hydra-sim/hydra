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