(function() {
    'use strict';

    angular
        .module('graph', [])
        .directive('graph', ['$parse', function($parse) {
            return {
                // required to make it work as an element
                restrict: 'E',

                // replace <graph> with this html
                template: '<canvas class="graph"></canvas>',
                replace: true,

                // observe and manipulate the DOM
                link : function(scope, element, attrs) {
                    var nodes_exp = $parse(attrs.nodes);
                    var nodes = nodes_exp(scope);

                    var ctx = element[0].getContext("2d");
                    ctx.canvas.width    = 960;
                    ctx.canvas.height   = 500;


                    scope.$watchCollection(nodes_exp, function(newVal, oldVal){
                        nodes = newVal;
                        update();
                    });

                    function clear() {
                        //noinspection SillyAssignmentJS
                        ctx.canvas.width = ctx.canvas.width;
                    }

                    function update() {
                        clear();
                        ctx.fillStyle = "#aaaaff";
                        var centerX = ctx.canvas.width / 2,
                            centerY = ctx.canvas.height / 2;

                        for(var i=0; i<nodes.length; i++) {
                            var x=nodes[i].x + centerX,
                                y=nodes[i].y + centerY;

                            ctx.beginPath();
                            ctx.arc(x,y,10,0,2*Math.PI);
                            ctx.fill();
                        }
                    }
                }
            }
        }]);
})();