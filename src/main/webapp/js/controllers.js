(function() {

    'use strict';

    var app = angular.module('unit.controllers', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'angularFileUpload',
        'zeroclipboard'
    ]);

    app.controller('ApplicationCtrl', function($scope, $rootScope, $location, menu_field_name) {

        $rootScope.menu_field_button = "New Simulation";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() {
            $location.path('/simulation/new');
        };

        $rootScope.menu_field_name = menu_field_name;
        menu_field_name.disable();
    });

    app.controller("TabCtrl", function($scope, $rootScope, $location) {

        $scope.tabs = [
            {name: "SIMULATIONS", link: "/"},
            {name: "TIMETABLES", link: "/timetable"},
            {name: "LOCATIONS", link: "/preset"},
        ];

        $scope.select= function(item) {
            $location.path(item.link);
            $location.replace();
        };

        $scope.itemClass = function(item) {
            return item.link == $location.path() ? 'active' : '';
        };
    });

    app.controller("CollapseCtrl", function($scope){

        $scope.isCollapsed = true;

    });

})();