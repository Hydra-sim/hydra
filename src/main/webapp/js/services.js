(function() {

    'use strict';

    var app = angular.module('services', [
        'ngResource'
    ]);

    app.factory('Simulation', ['$resource', function($resource) {
        return $resource('api/simulation/:simulationId', {simulationId: '@id'});
    }]);

    app.factory('SimResult', function() {
        return {
            data: {}
        }
    });

})();