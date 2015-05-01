(function() {

    'use strict';

    var app = angular.module('unit.controllers');


    app.controller('PresetCtrl', function($scope, $rootScope) {
        $rootScope.menu_field_button = "";
        $rootScope.menu_field_button_icon = "";
        $rootScope.menu_field_button_click = function () {};
    });

    app.controller('PresetListCtrl', function($scope, $rootScope, $modal, Preset) {
        function updatePresetScope() {
            $scope.presets = Preset.query({});
        }
        updatePresetScope();

        $scope.deletePreset = function(id) {
            var modalInstance = $scope.confirmation();

            modalInstance.result.then(function (selectedItem) {
                Preset.delete({}, {"id": id}, updatePresetScope);
            });
        };

        $scope.confirmation = function() {

            $scope.confirmed = false;

            var modalInstance = $modal.open({
                templateUrl: 'templates/modals/confirmation.html',
                controller: 'ConfirmationModalCtrl',
                size: 'sm'
            });

            return modalInstance;
        };

        $rootScope.menu_field_name.disable();
    });
})();