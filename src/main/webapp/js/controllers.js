(function() {

    'use strict';

    var app = angular.module('unit.controllers', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'ngFileUpload',
        'zeroclipboard',
        'angular-loading-bar',
        'ngAnimate'
    ]);

    app.controller('ApplicationCtrl', function($scope, $rootScope, $location, $modal, menu_field_name, menu_field_button) {

        $rootScope.menu_field_button = menu_field_button;

        menu_field_button.value = "New Simulation";
        menu_field_button.icon = "fa-plus-circle";
        menu_field_button.click = function() {

                $modal.open({
                    templateUrl: 'templates/modals/choosePreset.html',
                    controller:  'ChoosePresetModalCtrl',
                    size: 'sm'
                });
            //$location.path('/simulation/new');
        };

        $rootScope.menu_field_name = menu_field_name;
        menu_field_name.disable();

        $rootScope.simulationAuth = [];
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

    app.controller('ChoosePresetModalCtrl', function($scope, $modalInstance, $location, Preset){

        function updatePresetScope() {
            $scope.presets = Preset.query({});
        }
        updatePresetScope();

        $scope.loadPreset = function(presetList){
            if(presetList.item == "No Location"){
                $location.path("/simulation/new");
            }
            else{
                $location.path("/simulation/" + presetList.item[0]);
            }
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

    app.controller('FullDocumentationCtrl', function($scope, $location, $anchorScroll, menu_field_button){
        menu_field_button.reset();

        $scope.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        }
    });
})();