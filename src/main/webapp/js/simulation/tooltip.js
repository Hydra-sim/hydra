(function() {

    'use strict';

    var app = angular.module('simulation', []);

    app.controller('TooltipTestCtrl', function($scope){
        var tooltip = angular.element(document.getElementsByClassName('custom-tooltip'));
        var path = "../templates/tooltip/";

        $scope.open = function(templateUrl, posX, posY){
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
    });

    app.directive("customTooltip", function($compile) {
        return {
            template: "<div class='custom-tooltip'></div>",
            restrict: "A",
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {

                var graph = document.querySelector('graph');

            }
        }

    });
})()