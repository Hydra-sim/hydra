(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('PresetListCtrl', function($scope, menu_field_name, $modal, Preset) {
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

        menu_field_name.disable();
    });
})();