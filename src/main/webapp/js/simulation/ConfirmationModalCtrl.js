(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('ConfirmationModalCtrl', function($scope, $modalInstance) {

        $scope.confirm = function(){

            $modalInstance.close();
        };

        $scope.cancel = function() {

            $modalInstance.dismiss();
        }
    });

})();