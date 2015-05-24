(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller("NewPassengerflowModalCtrl", function($modalInstance){
        var ctrl = this;
        ctrl.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "60"},
            {label: "Hours", value: "3600"}
        ];
        ctrl.timeSelect = {
            item: ctrl.options[0]
        };

        ctrl.submitPassengerflow =  function(){
            var timeBetweenArrivals =
                ctrl.timeBetweenArrivals *
                ctrl.timeSelect.item.value;

            $modalInstance.close({
                'timeBetweenArrivals': timeBetweenArrivals,
                'personsPerArrival': ctrl.personsPerArrival
            });
        };

        ctrl.cancel = $modalInstance.dismiss;

    });

})();