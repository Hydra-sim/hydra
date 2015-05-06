(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('SimulationAnimationCtrl', function($routeParams, menu_field_button) {
        this.simulationId = $routeParams.id;
        menu_field_button.reset();
    });

})();