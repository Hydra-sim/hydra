(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('UploadTimetableModalCtrl', function($scope, $modalInstance) {
        $scope.confirm = function() {
            $modalInstance.close({
                name: $scope.name,
                file: $scope.file
            });
        };
        $scope.cancel  = $modalInstance.dismiss;
    });

})();