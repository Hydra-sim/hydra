(function() {

    'use strict';

    var app = angular.module('simulation', []);

    app.directive('radialmenu', function() {
        //noinspection HtmlUnknownBooleanAttribute
        return {
            // required to make it work as an element
            restricted: 'E',

            // replace <radialmenu> with this html
            template: '<nav class="circular-menu"><div class="outer-circle" ng-transclude></div><a class="menu-button fa fa-close fa-4x"></a></nav>',
            replace: true,
            transclude: true,

            scope: {
                control: '='
            },

            // observe and manipulate the DOM
            link : function(scope, element, attrs) {

                scope.internalControl = scope.control || {};
                scope.internalControl.close = close;
                scope.internalControl.getlastpos = getlastpos;

                var circularMenu    = element[0];
                var graph           = circularMenu.parentNode;
                var openBtn         = circularMenu.querySelector('.menu-button');
                var outerCircle     = circularMenu.querySelector('.outer-circle');
                var items           = circularMenu.querySelectorAll('.outer-circle .circle');

                for (var i = 0, l = items.length; i < l; i++) {
                    items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
                    items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
                }

                graph.oncontextmenu = open;
                openBtn.onclick = close;
                graph.onclick = close;

                var lastpos = {x:0, y:0};

                function open(e) {
                    e.preventDefault();

                    outerCircle.classList.add('open');

                    var parentPosition = getPosition(e.currentTarget);
                    var x = e.clientX - parentPosition.x;
                    var y = e.clientY - parentPosition.y;

                    lastpos.x = x;
                    lastpos.y = y;

                    var xPosition = x - (circularMenu.clientWidth / 2);
                    var yPosition = y - (circularMenu.clientHeight / 2);

                    circularMenu.style.left = xPosition + "px";
                    circularMenu.style.top = yPosition + "px";
                    circularMenu.style.visibility = "visible";
                    openBtn.style.display = "block";
                }

                function close(e) {
                    if(e != 'undefined' && e != null) e.preventDefault();
                    outerCircle.classList.remove('open');
                    openBtn.style.display = "none";
                    circularMenu.style.visibility = "hidden";
                }

                function getlastpos() {
                    return lastpos;
                }

                // source http://www.kirupa.com/html5/getting_mouse_click_position.htm
                function getPosition(element) {
                    var xPosition = 0;
                    var yPosition = 0;

                    while (element) {
                        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                        element = element.offsetParent;
                    }
                    return { x: xPosition, y: yPosition };
                }
            },

            controller: function($scope) {
                this.close = function() {
                    $scope.internalControl.close();
                }
            }
        }
    });

    app.directive('radialbutton', function() {
        return {
            require: '^radialmenu',
            restrict: 'E',

            template: '<div class="circle {{color}}"><a class="fa fa-2x {{icon}}" ng-transclude></a></div>',
            replace: true,
            transclude: true,

            scope: {
                color: '@',
                icon: '@'
            },

            // observe and manipulate the DOM
            link : function(scope, element, attrs, radialmenu) {
                element[0].onclick = radialmenu.close;
            }
        };
    });

})();