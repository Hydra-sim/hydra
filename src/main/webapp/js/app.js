(function() {

    'use strict';

    var app = angular.module('hydra', [
        'ngRoute',
        'unit.controllers',
        'graph'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/',                  {controller: 'ApplicationController',   templateUrl: 'templates/index.html'})

            // Simulation
            .when('/newsimulation',     {controller: 'SimulationNew',           templateUrl: 'templates/simulation/new.html'})
            .when('/result',            {controller: 'SimulationResult',        templateUrl: 'templates/simulation/result.html'})
            .when('/show/:id/',         {controller: 'SimulationShow',          templateUrl: 'templates/simulation/show.html'})

            // Timetable
            .when('/timetable',         {controller: 'TimetableController',     templateUrl: 'templates/timetable/index.html'})
            .when('/timetable/new',     {templateUrl: 'templates/timetable/new.html'})
            .when('/timetable/:id/',    {controller: 'TimetableEdit',           templateUrl: 'templates/timetable/show.html'})

            // Preset
            .when('/preset',            {templateUrl: 'templates/preset/index.html'})
            .when('/preset/new',        {templateUrl: 'templates/preset/new.html'})
            .when('/preset/:id/',       {templateUrl: 'templates/preset/show.html'})

            .otherwise({redirectTo : '/'})
    });


})();