(function() {

    'use strict';

    var app = angular.module('simulation', []);

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

})();