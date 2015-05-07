(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('NewConsumerModalCtrl', function($scope, $modalInstance, type){

        $scope.groupable = !!(type.toLowerCase() == 'new bagdrop' || type.toLowerCase() == 'new terminal');

        $scope.modalTitle = type;
        $scope.options = [
            {label: "Seconds", value: "1"},
            {label: "Minutes", value: "2"},
            {label: "Hours", value: "3"}
        ];

        $scope.submitConsumer = function(amountOfTime, timeSelectConsumer, numberOfConsumers){

            var ticksToConsumeEntities = amountOfTime; // Seconds by default

            switch(timeSelectConsumer.item.label) {

                case "Minutes":
                    ticksToConsumeEntities *= 60;
                    break;

                case "Hours":
                    ticksToConsumeEntities *= 60 * 60;
                    break;
            }

            if($scope.group) {

                $modalInstance.close({

                    'ticksToConsumeEntity': ticksToConsumeEntities,
                    'numberOfConsumers': numberOfConsumers
                });

            } else {

                $modalInstance.close({

                    'ticksToConsumeEntity': ticksToConsumeEntities
                });
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

})();