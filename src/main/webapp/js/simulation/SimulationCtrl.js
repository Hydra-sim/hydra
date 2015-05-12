(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationCtrl', function(menu_field_button, menu_field_name, $modal, $location) {
        menu_field_button.value = "New Simulation";
        menu_field_button.icon = "fa-plus-circle";
        menu_field_button.click = function() {

            $modal.open({
                templateUrl: 'templates/modals/choosePreset.html',
                controller:  'ChoosePresetModalCtrl',
                size: 'sm'
            }).result.then(function(result) {
                if(typeof result == "undefined") {
                    $location.path('/simulation/new');
                } else {
                    $location.path('/simulation/' + result);
                }
            });

        };

        menu_field_name.disable();
    });

})();