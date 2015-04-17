(function() {

    'use strict';

    var app = angular.module('services', [
        'ngResource'
    ]);

    app.factory('Simulation', ['$resource', function($resource) {
        return $resource('api/simulation/:simulationId', {simulationId: '@id'});
    }]);

    app.factory('Timetable', ['$resource', function($resource) {
        return $resource('api/timetable/:timetableId', {timetableId: '@id'},
            {
                'update': { method:'PUT' }
            });
    }]);

    app.factory('Preset', ['$resource', function($resource) {
        return $resource('api/preset/:presetId', {presetId: '@id'});
    }]);


    app.factory('Authentication', ['$resource', function($resource) {
        return $resource('api/auth/');
    }]);


    app.factory('SimResult', function() {
        return {
            data: {}
        }
    });

    app.factory('Map', ['$resource', function($resource) {
        return $resource('api/map/:mapId', {mapId: '@id'},
            {
                'update': { method:'PUT' }
            });
    }]);

    app.factory('menu_field_name', function() {
        return {
            value: '',
            enabled: false,
            disable: function() {
                this.enabled = false;
                this.value = "";
            },
            enable: function() {
                this.enabled = true;
            },
            setValue: function(value) {
                this.value = value;
                this.enable();
            }
        };
    });

})();