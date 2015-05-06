(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('NewProducerModalCtrl', function($scope, $modalInstance, Timetable, timetableIds, type){
        $scope.timetableIds = timetableIds;
        $scope.modalTitle = type;
        $scope.timetables = Timetable.query({});

        $scope.submitProducer = function(selectedItem){
            $modalInstance.close({
                'timetableId': selectedItem
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

})();