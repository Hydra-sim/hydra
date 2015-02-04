(function() {

    'use strict';

    var app = angular.module('hydra', [
        'ngRoute',
        'controllers'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {controller: 'ApplicationController', templateUrl: 'templates/index.html'})
    });


})();