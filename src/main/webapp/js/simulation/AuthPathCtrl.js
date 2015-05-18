(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('AuthPathCtrl', function($scope, $rootScope, $routeParams, $location, Authentication, menu_field_name) {

        $scope.id = $routeParams.id;

        $scope.wrongPassword = false;

        $scope.submitPassword = function(input) {

            var auth = new Authentication({
                'id': $routeParams.id,
                'input': input
            });

            auth.$save().then(function (result) {

                if (result.truefalse) {

                    $rootScope.simulationAuth.push($routeParams.id);
                    $location.path('/simulation/' + $routeParams.id);

                } else {

                    $scope.wrongPassword = true;
                    $rootScope.simulationAuth.push($routeParams.id);
                }
            });
        };

        menu_field_name.setValue("");
        menu_field_name.disable();
    });

})();