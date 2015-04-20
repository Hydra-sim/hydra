(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('TimetableCtrl', function($scope, $modal, $rootScope) {
        $rootScope.menu_field_button = "New Timetable";
        $rootScope.menu_field_button_icon = "fa-plus-circle";
        $rootScope.menu_field_button_click = function() {
            $modal.open({
                templateUrl: 'templates/timetable/new.html',
                controller:  'TimetableNewCtrl',
                size:        'sm'
            });
        };
    });

    app.controller('TimetableEditCtrl', function($scope, $routeParams, $rootScope, $location, $log, Timetable) {
        Timetable.get({}, {"id": $routeParams.id}, function(result) {
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