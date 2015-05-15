(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('MapModalCtrl', function($scope, $modalInstance, id) {
        this.id = id;
        this.zoom = 1;

        this.cancel = $modalInstance.dismiss;
        this.submitMap = function() {
            $modalInstance.close(this.zoom);
        };

        // When the number changes, update the transform string
        var that = this;
        $scope.$watch(
            function() { return that.zoom; },
            function(value) { that.scale = (value / 50) + 1;}
        );

    });

})();