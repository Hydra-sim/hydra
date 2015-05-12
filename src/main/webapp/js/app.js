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
        'ngFileUpload'
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
                controller: 'ApplicationCtrl',
                templateUrl: 'templates/index.html'
            })

            // Simulation
            .when('/simulation/new', {
                controller: 'SimulationNewCtrl',
                controllerAs: 'ctrl',
                templateUrl: 'templates/simulation/new.html'
            })
            .when('/simulation/:id', {
                controller: 'SimulationNewCtrl',
                templateUrl: 'templates/simulation/new.html'
            })
            .when('/result', {
                controller: 'SimulationResultCtrl',
                templateUrl: 'templates/simulation/result.html'
            })
            .when('/result/:id', {
                controller: 'SimulationResultCtrl',
                templateUrl: 'templates/simulation/result.html'
            })
            .when('/simulation/:id/auth', {
                controller: 'AuthPathCtrl',
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
                templateUrl: 'templates/timetable/index.html'
            })

            // Preset
            .when('/preset', {
                controller: 'PresetCtrl',
                templateUrl: 'templates/preset/index.html'
            })
            .when('/preset/:id/', {
                templateUrl: 'templates/preset/show.html'
            })

            // Other
            .when('/map', {
                controller: 'UploadMapCtrl',
                templateUrl: "templates/map.html"
            })
            .when('/documentation', {
                controller: 'FullDocumentationCtrl',
                templateUrl: 'templates/fulldocumentation.html'
            })
            .when('/colortest', {
                controller: 'ColorTestCtrl',
                templateUrl: 'templates/colortest.html'
            })
            .when('/home', {
                controller: 'ApplicationCtrl',
                templateUrl:'templates/home.html'
            })

            // Otherwise redirect to frontpage
            .otherwise({redirectTo : '/home'})
    });

})();