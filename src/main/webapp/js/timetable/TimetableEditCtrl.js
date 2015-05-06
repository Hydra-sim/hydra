(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('TimetableEditCtrl', function($scope, $rootScope, $location, $log, $modalInstance, $anchorScroll, $timeout, Timetable, id) {
        $scope.btnName = "Save";


        Timetable.get({}, {"id": id}, function(result) {
            $scope.id = result.id;

            $scope.arrivals = [];

            for(var i = 0; i < result.arrivals.length; i++) {

                var time = result.arrivals[i].time;

                var date = new Date();
                var hour =  Math.floor((time / 60 / 60 ) );

                time -= (hour * 60 * 60);

                date.setHours( hour );
                date.setMinutes( Math.floor( time / 60 ) );

                $log.info(result.arrivals);
                $scope.arrivals.push({time: date, passengers: result.arrivals[i].passengers});
            }

            $scope.totalArrivals = $scope.arrivals.length;
            $scope.name = result.name;

        });

        $scope.addLine = function() {
            var arrivalTime = new Date();
            arrivalTime.setHours( 0 );
            arrivalTime.setMinutes( 0 );

            $scope.arrivals.push({ time: arrivalTime, passengers: 0 });

            $timeout(function(){
                $location.hash('anchor');
                $anchorScroll();
            });

            // $scope.totalArrivals = $scope.arrivals.length;
        };

        $scope.ok = function () {
            var timetableArrivals = [];

            for(var i = 0; i < $scope.arrivals.length; i++) {

                var ticks = ($scope.arrivals[i].time.getHours() * 60 * 60) + ($scope.arrivals[i].time.getMinutes() * 60);
                timetableArrivals.push(
                    {
                        time: ticks,
                        passengers: $scope.arrivals[i].passengers
                    });
            }

            var timetable = new Timetable({
                id: $scope.id,
                name: $scope.name,
                arrivals: timetableArrivals
            });

            Timetable.update({"id": $scope.id}, timetable).$promise.then(function() {
                $rootScope.$emit('updateTimetable');
            });

            $modalInstance.close();


        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

})();