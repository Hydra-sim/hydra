(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('ConfigModalModalCtrl', function ($scope, $modalInstance, startTime, endTime) {

        $scope.startTime = startTime;
        $scope.endTime = endTime;
        $scope.wrongTime = false;

        $scope.submitConfig = function () {
            if($scope.startTime >= $scope.endTime){
                $scope.wrongTime = true;
            }
            else{
                var time = {startTime: $scope.startTime, endTime: $scope.endTime};
                $modalInstance.close(time);
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

})();