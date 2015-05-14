(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationListCtrl', function ($scope, $rootScope, Simulation, $location, $modal) {
        function updateSimulations() {
            $scope.simulations = Simulation.query({});
        }

        updateSimulations();

        $scope.auth = function (id, funcDesc) {

            Simulation.get({}, {'id': id}, function (result) {

                var func;

                switch (funcDesc) {
                    case 'edit':
                        func = $scope.editSimulation;
                        break;
                    case 'delete':
                        func = $scope.deleteSimulation;
                        break;
                    case 'show':
                        func = $scope.showSimulation;
                        break;
                    case 'setPassword':
                        func = $scope.setPassword;
                        break;
                    default:
                        func = null;
                }

                if (result.passwordProtected) {              // It really does find it

                    $modal.open({
                        templateUrl: 'templates/modals/passwordAuth.html',
                        controller: 'PasswordModalCtrl',
                        size: 'sm',
                        resolve: {
                            id: function () {
                                return id;
                            },
                            func: function () {
                                return func;
                            }
                        }
                    });

                } else {

                    func(id);
                }
            });
        };

        $scope.deleteSimulation = function (id) {

            var modalInstance = $scope.confirmation();

            modalInstance.result.then(function (selectedItem) {
                Simulation.delete({}, {"id": id}, function () {
                    $scope.simulations = Simulation.query({});
                });
            });
        };

        $scope.confirmation = function() {

            $scope.confirmed = false;

            var modalInstance = $modal.open({
                templateUrl: 'templates/modals/confirmation.html',
                controller: 'ConfirmationModalCtrl',
                size: 'sm'
            });

            return modalInstance;
        };

        $scope.editSimulation = function (id) {

            $location.path('/simulation/' + id);

        };

        $scope.shareSimulation = function (id) {

            $modal.open({
                templateUrl: 'templates/modals/shareSimulation.html',
                controller: 'ShareSimulationModalCtrl',
                size: 'sm',
                resolve: {
                    id: function () {
                        return id;
                    },
                    message: function(){
                        return  $location.absUrl() + "/" + id;
                    }
                }
            });

        };

        $scope.showSimulation = function (id) {

            $location.path('/result/' + id);
        };

        $scope.setPassword = function (id) {

            Simulation.get({}, {'id': id}, function (result) {

                var path;

                if (result.passwordProtected) {              // It really does find it

                    path = 'templates/modals/changePassword.html';

                } else {

                    path = 'templates/modals/newPassword.html';
                }

                $modal.open({
                    templateUrl: path,
                    controller: 'ChangePasswordCtrl',
                    size: 'sm',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });
            });
        };
    });

})();