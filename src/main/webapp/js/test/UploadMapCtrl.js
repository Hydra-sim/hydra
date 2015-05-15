(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('UploadMapCtrl', function($scope, $modal, Upload){

        $scope.image = {};

        // When the number changes, update the transform string
        $scope.$watch("image.zoom", function(value) {
            $scope.image.scale = (value / 50) + 1;
        });

        $scope.openMapModal = function() {

            Upload.upload({
                url: 'api/map',
                file: $scope.file[0]
            }).success(function(data, status, headers, config) {
                $scope.image.id = data.id;
                $scope.image.zoom = data.zoom;

                var promise = $modal.open({
                    templateUrl: 'templates/modals/mapModal.html',
                    controller: 'MapModalCtrl',
                    controllerAs: 'ctrl',
                    resolve: {
                        id: function () {
                            return $scope.image.id;
                        }
                    }
                });

                promise.result.then(function(zoom) {
                    $scope.image.zoom = zoom;
                });

            });
        }
    });

})();