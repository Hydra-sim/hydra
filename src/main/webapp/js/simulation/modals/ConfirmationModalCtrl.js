(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('ConfirmationModalCtrl', function($scope, $modalInstance) {

        $scope.confirm = $modalInstance.close;
        $scope.cancel = $modalInstance.dismiss;
    });

})();