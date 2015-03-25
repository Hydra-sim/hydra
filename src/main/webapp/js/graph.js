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

                scope: {
                    nodes: '=',
                    edges: '='
                },

                // observe and manipulate the DOM
                link : function(scope, element, attrs) {
                    var width  = 960,
                        height = 500;

                    var consts =  {
                        selectedClass: "selected",
                        connectClass: "connect-node",
                        circleGClass: "node",
                        activeEditId: "active-editing",
                        BACKSPACE_KEY: 8,
                        DELETE_KEY: 46,
                        ENTER_KEY: 13,
                        nodeRadius: 20
                    };

                    var selectedCircle = null;
                    var selecetdCircleData = null;

                    var svg = d3.select(element[0])
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);

                    scope.$watch('nodes', update, true);
                    scope.$watch('edges', update, true);

                    // svg nodes and edges
                    var paths = svg.append("g").selectAll("g");
                    var circles = svg.append("g").selectAll("g");

                    svg
                        .on("mousemove", function() {
                            var mouse = d3.mouse(this);

                            if(selectedCircle != null ) {
                                console.log(selecetdCircleData);
                                selecetdCircleData.x = mouse[0];
                                selecetdCircleData.y = mouse[1];
                                update();
                            }
                        });

                    function update() {

                        // update existing nodes
                        circles = circles.data(scope.nodes, function(d){ return d.id;});
                        circles.attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";});

                        // add new nodes
                        var newGs= circles
                            .enter()
                            .append("g");

                        newGs
                            .attr('class', function(d) { return d.type + " " + consts.circleGClass; })
                            .attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
                            .on("mousedown", function(d){
                                selectedCircle = d3.select(this);
                                selecetdCircleData = d;
                                selectedCircle.classed(consts.selectedClass, true);
                            })
                            .on("mouseup", function(d){
                                selectedCircle.classed(consts.selectedClass, false);
                                selectedCircle = null;
                                selecetdCircleData = null;
                            });

                        newGs
                            .append("circle")
                            .attr("r", String(consts.nodeRadius));

                        // remove old nodes
                        circles.exit().remove();
                    }
                    update();
                }
            }
        }]);
})();