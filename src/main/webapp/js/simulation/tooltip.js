(function() {

    'use strict';

    var app = angular.module('tooltip', []);

    app.controller('TooltipTestCtrl', function ($scope, $compile) {
        /*
        var tooltip = angular.element(document.getElementsByClassName('custom-tooltip'));
        var path = "templates/tooltip/";

        $scope.open = function (templateUrl, posX, posY) {
            tooltip.empty();
            tooltip.append(
                $compile("<div class='inner-tooltip' ng-include='\"" + path + templateUrl + "\"'></div>")
                ($scope));
            tooltip.css({
                "position": "absolute",
                "display": "block",
                "opacity": "1",
                "left": posX + "px",
                "top": posY + "px"
            });
        }
        */
    });

    app.directive('customTooltip', function($compile) {
        return {
            // required to make it work as an element
            restricted: 'E',

            // replace <tooltip> with this html
            template: '<div class="custom-tooltip"></div>',
            replace: true,

            scope: {
                templateUrl: '='
            },

            link : function(scope, element, attrs) {
                var posX = 200;
                var posY = 500;

                scope.$watch('templateUrl', function(newVal) {
                    if(newVal) {
                        element.empty();
                        element.append(
                            $compile("<div class='inner-tooltip' ng-include='" + scope.templateUrl + "'></div>")(scope)
                        );
                    }
                }, true);

                /*
                element.css({
                    "position": "absolute",
                    "display": "block",
                    "opacity": "1",
                    "left": posX + "px",
                    "top": posY + "px"
                });
                */
            }
        };
    });
})();