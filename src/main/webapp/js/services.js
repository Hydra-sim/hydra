(function() {

    'use strict';

    var app = angular.module('services', [
        'ngResource'
    ]);

    app.factory('Simulation', ['$resource', function($resource) {
        return $resource('api/simulation/:simulationId', {simulationId: '@id'},
            {
                'update': { method: 'PUT' },
                'run': { method: 'GET', url: 'api/simulation/:simulationId/run', params: {simulationId: '@id'}}
            });
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
        return {};
    });

    app.factory('Map', ['$resource', function($resource) {
        return $resource('api/map/:mapId', {mapId: '@id'});
    }]);

    app.factory('menu_field_name', function() {
        return {
            value: '',
            enabled: false,
            readonly: false,
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

    app.factory('menu_field_button', function() {
        return {
            value: "",
            icon: "",
            click: function() {},
            reset: function() {
                this.value = "";
                this.icon = "";
                this.click = function() {};
            }
        };
    });

    app.factory('Session', function($http) {

        var Session = {
            data: {
                ids: []
            },
            updateSession: function() {
                Session.data = $http.get('session.json').then(function(r) { return r.data;});
            }
        };

        Session.updateSession();
        return Session;
    });

    app.factory('TmpSimulationData', function() {
        return {
            nodes: [],
            edges: [],
            reset: function() {
                this.nodes = [];
                this.edges = [];
            }
        };
    })
})();