(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('TimetableCtrl', function($scope, $modal, menu_field_button) {
        menu_field_button.value = "New Timetable";
        menu_field_button.icon = "fa-plus-circle";
        menu_field_button.click = function() {
            $modal.open({
                templateUrl: 'templates/timetable/new.html',
                controller:  'TimetableNewCtrl',
                size:        'lg'
            });
        };
    });


})();