(function() {

    'use strict';

    var app = angular.module('hydra', [
        'ngRoute',
        'unit.controllers',
        'graph',
        'simulation',
        'zeroclipboard',
        'tooltip',
        'angular-loading-bar'
    ]);

    app.config(['uiZeroclipConfigProvider', function(uiZeroclipConfigProvider) {

        // config ZeroClipboard
        uiZeroclipConfigProvider.setZcConf({
            swfPath: 'vendor/zeroclipboard/dist/ZeroClipboard.swf'
        });

    }]);

    app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {   // Turn off spinner in top left corner of
        cfpLoadingBarProvider.includeSpinner = false;                       // loading bar
    }]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/',                  {controller: 'ApplicationCtrl',         templateUrl: 'templates/index.html'})

            // Simulation
            .when('/simulation/new',    {controller: 'SimulationNewCtrl',       templateUrl: 'templates/simulation/new.html'})
            .when('/simulation/:id',    {controller: 'SimulationEditCtrl',      templateUrl: 'templates/simulation/new.html'})
            .when('/result',            {controller: 'SimulationResultCtrl',    templateUrl: 'templates/simulation/result.html'})
            .when('/show/:id/',         {controller: 'SimulationShowCtrl',      templateUrl: 'templates/simulation/show.html'})
            .when('/simulation/:id' +
                    '/auth',            {controller: 'AuthPathCtrl',            templateUrl: "templates/modals/passwordAuth.html"})

            // Timetable
            .when('/timetable',         {controller: 'TimetableCtrl',           templateUrl: 'templates/timetable/index.html'})
            .when('/timetable/new',     {templateUrl: 'templates/timetable/new.html'})
            .when('/timetable/:id/',    {controller: 'TimetableEditCtrl',       templateUrl: 'templates/timetable/show.html'})

            // Preset
            .when('/preset',            {controller: 'PresetCtrl',              templateUrl: 'templates/preset/index.html'})
            .when('/preset/new',        {templateUrl: 'templates/preset/new.html'})
            .when('/preset/:id/',       {templateUrl: 'templates/preset/show.html'})

            .when('/map',               {controller: 'UploadMapCtrl',           templateUrl: "templates/map.html"})
            .when('/tooltip',           {controller: 'TooltipTestCtrl',         templateUrl: "templates/tooltip/testTooltip.html"})
            .when('/documentation',     {controller: 'FullDocumentationCtrl',   templateUrl: 'templates/fulldocumentation.html' })
            .when('/loadingscreen',     {templateUrl: 'templates/simulation/loadingscreen.html'})

            .otherwise({redirectTo : '/'})
    });


})();