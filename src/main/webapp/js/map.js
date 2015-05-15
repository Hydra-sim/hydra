(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('UploadMapCtrl', function($scope, $modal, Upload){

        $scope.image = { visible: true, id: 86, exists: true, zoom: 0};
        $scope.image2 = {scale: 1, zoom: 0};

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

        $scope.openMapModal = function() {

            Upload.upload({
                url: 'api/map',
                file: $scope.file[0]
            }).success(function(data, status, headers, config) {
                $scope.image.id = data.id;

                $modal.open({
                    templateUrl: 'templates/modals/mapModal.html',
                    controller: 'MapModalCtrl',
                    controllerAs: 'ctrl',
                    resolve: {
                        image: function () {
                            return $scope.image;
                        }
                    }
                });

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