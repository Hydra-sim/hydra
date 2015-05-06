(function() {

    'use strict';

    var app = angular.module('unit.controllers');

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

})();