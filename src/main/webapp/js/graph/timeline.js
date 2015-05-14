(function() {

    "use strict";

    var app = angular.module('directive.timeline', []);

    app.directive('timeline', function($interval) {
        return {
            // required to make it work as an element
            restricted: 'E',

            template: '<div>' +
                '<p class="labels"><span>{{startTime}}</span><span style="float: right">{{endTime}}</span></p>' +
                '<input type="range" name="points" min="0" max="{{max}}" step="1" ng-model="position">' +
                '<div class="progressButtons">' +
                    '<span class="fa fa-backward" ng-click="ctrl.backward()"></span>' +
                    '<span ng-class="{true: \'fa fa-pause\', false: \'fa fa-play\'}[ctrl.play==true]" ng-click="ctrl.playpause()"></span>' +
                    '<span class="fa fa-forward" ng-click="ctrl.forward()"></span>' +
                '</div>' +
            '</div>',

            replace: true,

            scope: {
                'startTime': '=',
                'endTime': '=',
                'position': '=',
                'max': '='
            },

            link: function(scope, element, attrs) {

            },

            controllerAs: 'ctrl',
            controller: function($scope) {
                this.play = false;
                var interval,
                    that = this;

                this.backward = function() {
                    if($scope.position > 0)
                        $scope.position--;
                };

                this.forward = function() {
                    if($scope.position < $scope.max) {
                        $scope.position++;
                    } else {
                        that.play = false;
                        $interval.cancel(interval);
                    }
                };

                this.playpause = function() {
                    that.play = !that.play;

                    $interval.cancel(interval);

                    if(that.play) {
                        interval = $interval(that.forward, 500);
                    }
                };
            }
        };
    });

})();