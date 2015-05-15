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
            var promise = $modal.open({
                templateUrl: 'templates/modals/mapModal.html',
                controller: 'MapModalCtrl',
                controllerAs: 'ctrl'
            });

            promise.result.then(function(data) {
                Upload.upload({
                    url: 'api/map',
                    file: data.file,
                    fields: {
                        'zoom': data.zoom
                    }
                }).success(function(d) {
                    $scope.image.id = d.id;
                    $scope.image.zoom = d.zoom;
                })
            });
        }
    });

})();