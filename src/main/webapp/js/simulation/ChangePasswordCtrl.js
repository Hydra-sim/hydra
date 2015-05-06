(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('ChangePasswordCtrl', function( $scope, $modalInstance, $rootScope, $location, id, Simulation ) {


        $scope.passwordMismatch = false;

        $scope.submitPassword = function( password, repPassword ) {

            if(password == repPassword) {

                var sim = new Simulation({
                    'id':    id,
                    'input': password
                });

                Simulation.update({}, sim).$promise.then(function() {
                    $rootScope.$emit('updateSimulations');
                    $location.path('/#');
                });

                $modalInstance.close();

            } else {

                $scope.passwordMismatch = true;
            }

        };

        $scope.deletePassword = function () {

            $scope.submitPassword(null);
        };

        $scope.cancel = function(){
            $modalInstance.dismiss();
        };
    });

})();