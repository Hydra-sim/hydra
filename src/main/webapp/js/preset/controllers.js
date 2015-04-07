(function() {

    'use strict';

    var app = angular.module('preset', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'angularFileUpload'
    ]);


    app.controller('presetModalInstanceCtrl', function(){

    });

    app.controller('PresetController', function($scope, $rootScope) {
        $rootScope.menu_field_button = "New Preset";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() { alert("Not implemented"); };
    });

    app.controller('PresetList', function($scope, $rootScope, Preset) {
        function updatePresetScope() {
            $scope.presets = Preset.query({});
        }
        updatePresetScope();

        $scope.deletePreset = function(id) {
            Preset.delete({}, {"id": id}, updatePresetScope);
        };
    });

})();