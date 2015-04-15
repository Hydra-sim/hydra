(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('TimetableCtrl', function($scope, $modal, $rootScope) {
        $rootScope.menu_field_button = "New Timetable";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() {
            $modal.open({
                templateUrl: 'templates/timetable/new.html',
                controller: 'TimetableNewCtrl'
            });
        };
    });

    app.controller('TimetableEditCtrl', function($scope, $routeParams, $rootScope, $location, $log, Timetable) {
        Timetable.get({}, {"id": $routeParams.id}, function(result) {
            $scope.id = result.id;
            $scope.arrivals = result.arrivals;
            $scope.totalArrivals = result.arrivals.length;
            $scope.name = result.name;
        });

        $log.info($scope.arrivals);
        var time = 3900;
        $scope.arrivalTime = new Date();

        var hour = Math.floor((time / 60 / 60 ));       // I KNOW THIS IS NOT PRETTY,
        time -= (hour * 60 * 60);                       // BUT MY BRAIN DOESN'T WORK RIGHT NOW.
                                                        // TODO: Make pretty
        $scope.arrivalTime.setHours( hour );
        $scope.arrivalTime.setMinutes( Math.floor( time / 60 ) );

        $scope.addLine = function() {

            $scope.arrivals.push({ time: 0, passengers: 0 });
            $scope.totalArrivals = $scope.arrivals.length;
        };

        $scope.ok = function () {
            var timetable = new Timetable({
                id: $scope.id,
                name: $scope.name,
                arrivals: $scope.arrivals
            });
            Timetable.update({"id": $scope.id}, timetable).$promise.then(function() {
                $rootScope.$emit('updateTimetable');
                $location.path('/timetable');
            });
        };

        $scope.cancel = function () {
            $location.path('/timetable');
        };
    });


    app.controller('TimetableNewCtrl', function($scope, $rootScope, $log, $modalInstance, Timetable) {

        var time = 0;
        $scope.arrivalTime = new Date();

        var hour = Math.floor((time / 60 / 60 ));       // I KNOW THIS IS NOT PRETTY,
        time -= (hour * 60 * 60);                       // BUT MY BRAIN DOESN'T WORK RIGHT NOW.
                                                        // TODO: Make pretty
        $scope.arrivalTime.setHours( hour );
        $scope.arrivalTime.setMinutes( Math.floor( time / 60 ) );

        //var time = ($scope.arrivalTime.getHours() * 60 * 60) + ($scope.arrivalTime.getMinutes() * 60);
        $scope.arrivals = [
            { time: time, passengers: 0 }
        ];

        $scope.name = "";

        $scope.addLine = function() {
            var time = ($scope.arrivalTime.getHours() * 60 * 60) + ($scope.arrivalTime.getMinutes() * 60);
            $scope.arrivals.push({ time: time, passengers: 0 });
        };

        $scope.ok = function () {
            var timetable = new Timetable({
                name: $scope.name,
                arrivals: $scope.arrivals
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

    app.controller('TimetableListCtrl', function($scope, $rootScope, Timetable) {
        function updateTimetableScope() {
            $scope.timetables = Timetable.query({});
        }
        updateTimetableScope();

        $rootScope.$on('updateTimetable', updateTimetableScope);

        $scope.deleteTimetable = function(id) {
            Timetable.delete({}, {"id": id}, updateTimetableScope);
        };
    });

})();