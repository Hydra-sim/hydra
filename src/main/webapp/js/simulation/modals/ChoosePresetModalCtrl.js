(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('ChoosePresetModalCtrl', function($scope, $modalInstance, Preset){
        $scope.presets = Preset.query({});

        $scope.loadPreset = function(selected){
            if(selected == "No Location"){
                $modalInstance.close();
            }
            else{
                $modalInstance.close(selected);
            }
        };

        $scope.cancel = $modalInstance.dismiss;
    });

})();