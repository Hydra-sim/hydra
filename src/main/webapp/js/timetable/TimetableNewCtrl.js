(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('TimetableNewCtrl', function($scope, $rootScope, $modalInstance, Timetable) {
        $scope.btnName = "Add";
        $scope.name = "";

        var arrivalTime = new Date();
        arrivalTime.setHours( 0 );
        arrivalTime.setMinutes( 0 );

        $scope.arrivals = [
            { time: arrivalTime, passengers: 0 }
        ];

        $scope.addLine = function() {
            $scope.arrivals.push({ time: arrivalTime, passengers: 0 });
        };

        $scope.ok = function () {

            var timetableArrivals = [];

            for(var i = 0; i < $scope.arrivals.length; i++) {

                var ticks = ($scope.arrivals[i].time.getHours() * 60 * 60) + ($scope.arrivals[i].time.getMinutes() * 60);
                timetableArrivals.push({time: ticks, passengers: $scope.arrivals[i].passengers});
            }

            var timetable = new Timetable({
                name: $scope.name,
                arrivals: timetableArrivals
            });

            timetable.$save().then(function() {
                $rootScope.$emit('updateTimetable');
            });

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

})();