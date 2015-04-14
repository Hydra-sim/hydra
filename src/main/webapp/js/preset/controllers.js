(function() {

    'use strict';

    var app = angular.module('unit.controllers');


    app.controller('PresetCtrl', function($scope, $rootScope) {
        $rootScope.menu_field_button = "New Preset";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() { alert("Not implemented"); };
    });

    app.controller('PresetListCtrl', function($scope, $rootScope, Preset) {
        function updatePresetScope() {
            $scope.presets = Preset.query({});
        }
        updatePresetScope();

        $scope.deletePreset = function(id) {
            Preset.delete({}, {"id": id}, updatePresetScope);
        };

        $rootScope.menu_field_name.disable();
    });
})();