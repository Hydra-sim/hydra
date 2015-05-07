(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('PasswordModalCtrl', function($scope, $rootScope, $modalInstance, id, func, Authentication) {

        $scope.id = id;

        $scope.wrongPassword = false;

        $scope.submitPassword = function(input){

            var auth = new Authentication({
                'id':    id,
                'input': input
            });

            auth.$save().then(function(result) {

                if(result.truefalse) {

                    func(id);
                    $modalInstance.close();
                    $rootScope.simulationAuth.push(id);

                } else {

                    $scope.wrongPassword = true;
                }
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

})();