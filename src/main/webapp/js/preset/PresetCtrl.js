(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('PresetCtrl', function($scope, menu_field_button) {
        menu_field_button.reset();
    });

})();