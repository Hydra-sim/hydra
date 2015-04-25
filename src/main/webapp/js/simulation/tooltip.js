(function() {

    var app = angular.module('simulation', []);

    app.controller('TooltipTestCtrl', function($scope) {

    });

    app.directive("myTooltipTemplate", function ($compile) {
        return {
            template: "<div class='custom-tooltip'></div>",
            restrict: "E",
            transclude: true,
            scope: {
                control: '='
            },
            link: function (scope, element, attrs) {

                var tooltipElement = element[0];
                var path = "templates/tooltip/"

                function open (templateUrl, posX, posY){
                    tooltipElement.empty();
                    tooltipElement.append("<div ng-include='\"" + path + templateUrl + "\"'></div>")
                    tooltipElement.css({
                        position: "absolute",
                        display: "block",
                        left: posX + "px",
                        top: posY + "px"
                    });
                }
            }
        };

    });
})()