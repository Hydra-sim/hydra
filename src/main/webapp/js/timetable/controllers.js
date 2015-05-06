(function() {

    'use strict';

    var app = angular.module('unit.controllers');

    app.controller('TimetableCtrl', function($scope, $modal, menu_field_button) {
        menu_field_button.value = "New Timetable";
        menu_field_button.icon = "fa-plus-circle";
        menu_field_button.click = function() {
            $modal.open({
                templateUrl: 'templates/timetable/new.html',
                controller:  'TimetableNewCtrl',
                size:        'lg'
            });
        };
    });

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

    app.controller('TimetableNewCtrl', function($scope, $rootScope, $log, $modalInstance, Timetable) {
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

    app.controller('TimetableListCtrl', function($scope, $rootScope, $modal, Timetable, Upload) {
        function updateTimetableScope() {
            $scope.timetables = Timetable.query({});
        }
        updateTimetableScope();

        $rootScope.$on('updateTimetable', updateTimetableScope);

        $scope.deleteTimetable = function(id) {
            var modalInstance = $modal.open({
                templateUrl: 'templates/modals/confirmation.html',
                controller: 'ConfirmationModalCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function () {
                Timetable.delete({}, {"id": id}, updateTimetableScope);
            });
        };

        $scope.editTimetable = function(id) {
            $modal.open({
                templateUrl: 'templates/timetable/show.html',
                controller: 'TimetableEditCtrl',
                size: 'lg',
                resolve: {
                id: function(){
                    return id;
                }
            }
            });
        };


        $scope.uploadTimetable = function() {
            $modal.open({
                templateUrl: 'templates/modals/uploadTimetable.html',
                controller: 'UploadTimetableModalCtrl',
                size: 'sm'
            }).result.then(function(result) {
                Upload.upload({
                    url: 'api/timetable',
                    fields: {'name': result.name},
                    file: result.file[0]
                }).success(updateTimetableScope);
            });
        }
    });

    app.controller('UploadTimetableModalCtrl', function($scope, $modalInstance) {
        $scope.confirm = function() {
            $modalInstance.close({
                name: $scope.name,
                file: $scope.file
            });
        };
        $scope.cancel  = $modalInstance.dismiss;
    });

})();