(function() {

    'use strict';

    var app = angular.module('timetable', [
        'ngRoute',
        'services',
        'ui.bootstrap',
        'angularFileUpload'
    ]);

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

    app.controller('TimetableEditCtrl', function($scope, $routeParams, $rootScope, $location, Timetable) {
        Timetable.get({}, {"id": $routeParams.id}, function(result) {
            $scope.id = result.id;
            $scope.arrivals = result.arrivals;
            $scope.totalArrivals = result.arrivals.length;
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


    app.controller('TimetableNewCtrl', function($scope, $rootScope, $modalInstance, Timetable) {
        $scope.arrivals = [
            { time: 0, passengers: 0 }
        ];

        $scope.name = "";

        $scope.addLine = function() {
            $scope.arrivals.push({ time: 0, passengers: 0 });
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