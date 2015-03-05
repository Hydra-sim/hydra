(function() {
    'use strict';

    angular
        .module('graph', [])
        .directive('graph', ['$parse', function($parse) {
            return {
                // required to make it work as an element
                restrict: 'E',

                // replace <graph> with this html
                template: '<div class="graph"></div>',
                replace: true,

                // observe and manipulate the DOM
                link : function(scope, element, attrs) {
                    var width  = 960,
                        height = 500;

                    var nodes_exp = $parse(attrs.nodes);
                    var nodes = nodes_exp(scope);

                    var edges_exp = $parse(attrs.edges);
                    var edges = edges_exp(scope);


                    var svg = d3.select(element[0])
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);

                    scope.$watchCollection(nodes_exp, function(newVal, oldVal){
                        nodes = newVal;
                        update();
                    });

                    scope.$watchCollection(edges_exp, function(newVal, oldVal){
                        edges = newVal;
                        update();
                    });

                    var graph = new GraphCreator(svg, nodes, edges);
                    graph.setIdCt(2);
                    graph.updateGraph();

                    function update() {
                        graph.updateGraph();
                    }
                }
            }
        }]);
})();