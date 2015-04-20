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
                graphClass: '@'
            },

            // observe and manipulate the DOM
            link : function(scope, element, attrs) {

                var consts = {
                    menuButtonClass: '.menu-button',
                    outerCircleClass: '.outer-circle',
                    graphClass: scope.graphClass || '.graph'
                };

                var circularMenu    = element[0];
                var openBtn         = document.querySelector(consts.menuButtonClass);
                var outerCircle     = document.querySelector(consts.outerCircleClass);
                var graph           = document.querySelector(consts.graphClass);
                var items           = document.querySelectorAll('.outer-circle .circle');

                for (var i = 0, l = items.length; i < l; i++) {
                    items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
                    items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
                }

                graph.oncontextmenu = open;
                openBtn.onclick = close;
                graph.onclick = close;

                function open(e) {
                    e.preventDefault();

                    outerCircle.classList.add('open');
                    var xPosition = e.clientX - (circularMenu.clientWidth / 2);
                    var yPosition = e.clientY - (circularMenu.clientHeight / 2);

                    circularMenu.style.left = xPosition + "px";
                    circularMenu.style.top = yPosition + "px";
                    circularMenu.style.visibility = "visible";
                    openBtn.style.display = "block";
                }

                function close(e) {
                    e.preventDefault();
                    outerCircle.classList.remove('open');
                    openBtn.style.display = "none";
                    circularMenu.style.visibility = "hidden";
                }
            }
        }
    });

})();