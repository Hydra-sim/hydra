(function() {

    'use strict';

    var app = angular.module('controllers', [
        'ngRoute'
    ]);

    app.controller('ApplicationController', ['$scope', function ($scope) {
        $scope.message = 'Everyone come and see how good I look!';
    }]);

})();