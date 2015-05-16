(function() {

    'use strict';

    var app = angular.module('hydra', [
        'ngRoute',
        'unit.controllers',
        'graph',
        'simulation',
        'zeroclipboard',
        'angular-loading-bar',
        'unit.directives',
        'ngFileUpload',
        'directive.timeline'
    ]);

    app.config(['uiZeroclipConfigProvider', function(uiZeroclipConfigProvider) {
        // config ZeroClipboard
        uiZeroclipConfigProvider.setZcConf({
            swfPath: 'vendor/zeroclipboard/dist/ZeroClipboard.swf'
        });
    }]);

    app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        // Turn off spinner in top left corner of loading bar
        cfpLoadingBarProvider.includeSpinner = false;
    }]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/index.html'
            })

            // Simulation
            .when('/simulation', {
                controller: 'SimulationCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/simulation/index.html'
            })
            .when('/simulation/new', {
                controller: 'SimulationNewCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/simulation/new.html'
            })
            .when('/simulation/:id', {
                controller: 'SimulationNewCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/simulation/new.html'
            })
            .when('/result', {
                controller: 'SimulationResultCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/simulation/result.html'
            })
            .when('/result/:id', {
                controller: 'SimulationResultCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/simulation/result.html'
            })
            .when('/simulation/:id/auth', {
                controller: 'AuthPathCtrl',
                controllerAs: 'ctrl',
                templateUrl: "templates/modals/passwordAuth.html"
            })
            .when('/simulation/:id/animation', {
                controller: 'SimulationAnimationCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/simulation/animation.html'
            })

            // Timetable
            .when('/timetable', {
                controller: 'TimetableCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/timetable/index.html'
            })

            // Preset
            .when('/preset', {
                controller: 'PresetCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/preset/index.html'
            })

            // Other
            .when('/documentation', {
                controller: 'FullDocumentationCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/fulldocumentation.html'
            })
            .when('/colortest', {
                controller: 'ColorTestCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/colortest.html'
            })

            // Otherwise redirect to frontpage
            .otherwise({redirectTo : '/'})
    });

})();