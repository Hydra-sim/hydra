(function() {

    'use strict';

    var app = angular.module('hydra', [
        'ngRoute',
        'unit.controllers'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {controller: 'ApplicationController', templateUrl: 'templates/index.html'})
            .when('/newsimulation', {controller: 'SimulationNew', templateUrl: 'templates/simulation/new.html'})
            .when('/result', {controller: 'SimulationResult', templateUrl: 'templates/simulation/result.html'})
            .otherwise({redirectTo : '/'})
    });


})();