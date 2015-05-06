(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller("NewPassengerflowModalCtrl", function($scope, $modal, $modalInstance){
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitPassengerflow =  function(totalNumberOfEntities, numberOfEntities, timeBetweenArrivals , timeSelect){
            if(timeSelect.item.label == "Minutes"){
                timeBetweenArrivals *= 60;
            }
            else if(timeSelect.item.label == "Hours"){
                timeBetweenArrivals *= 60 * 60;
            }

            $modalInstance.close({
                'timeBetweenArrivals': timeBetweenArrivals,
                'personsPerArrival': numberOfEntities
            });
        };

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

    });

})();