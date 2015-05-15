(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('UploadMapCtrl', function($scope, $modal, Map){

        $scope.image = { visible: true, id: 86, exists: true, zoom: 0};
        $scope.image2 = {scale: 1, zoom: 0};

        $scope.toggleImage = function() {
            $scope.image.visible = !$scope.image.visible;
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

        $scope.openMapModal = function() {

            $modal.open({
                templateUrl: 'templates/mapModal.html',
                controller: 'MapModalCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    image: function () {
                        return $scope.image;
                    }
                }
            });
        }
    });

    app.controller('MapModalCtrl', function($modalInstance, image) {
        this.image = image;
        this.cancel = $modalInstance.dismiss;
        this.submitMap = function() {
            $modalInstance.close(this.image);
        };
    });

})();