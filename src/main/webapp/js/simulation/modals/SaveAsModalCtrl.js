(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SaveAsModalCtrl', function($scope, $modalInstance, simulationName, menu_field_name){

        $scope.simulationName = simulationName;

        $scope.saveAs = function() {

            menu_field_name.setValue($scope.simulationName);
            $modalInstance.close();
        };

        $scope.cancel = function() {

            $modalInstance.dismiss();
        };
    });

})();