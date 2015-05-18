(function() {

    'use strict';

    var app = angular.module('services', [
        'ngResource'
    ]);

    app.factory('Simulation', ['$resource', function($resource) {
        return $resource('api/simulation/:simulationId', {simulationId: '@id'},
            {
                'update': { method: 'PUT' },
                'run': { method: 'PUT', url: 'api/simulation/:simulationId/run' }
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
            setValue: function(value, readonly) {
                this.value = value;
                this.enable();

                if(typeof readonly != 'undefined' && readonly != null)
                    this.readonly = readonly;
            }
        };
    });

    app.factory('menu_field_button', function($rootScope) {

        var value = {
            value: "",
            icon: "",
            click: function() {},
            reset: function() {
                this.value = "";
                this.icon = "";
                this.click = function() {};
            },
            update: function(val, ico, func) {
                this.value = val;
                this.icon = ico;
                this.click = func;
            }
        };

        $rootScope.$on("$routeChangeSuccess", function() { value.reset(); });

        return value;
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

})();