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
                    edges: '=',
                    width: '=',
                    height: '=',
                    nodeRadius: '=',
                    selectedClass: '=',
                    connectClass: '=',
                    circleGClass: '='
                },

                // observe and manipulate the DOM
                link : function(scope, element, attrs) {
                    // Constants like classes and similar
                    var consts =  {
                        selectedClass: scope.selectedClass || "selected",
                        connectClass: scope.connectClass || "connect-node",
                        circleGClass: scope.circleGClass || "node",
                        nodeRadius: scope.nodeRadius || 20,
                        DELETE_KEY: 8
                    };

                    // Circle to move, and selected circle
                    var selectedCircle = null;
                    var circleToMoveData = null;

                    // Create the svg element
                    var svg = d3.select(element[0])
                        .append("svg")
                        .attr("width", scope.width || 960)
                        .attr("height", scope.height || 500);

                    // Watch angular properties for changes
                    // trigger an update if they do change
                    scope.$watch('nodes', update, true);
                    scope.$watch('edges', update, true);

                    // svg nodes and edges
                    var paths = svg.append("g").selectAll("g");
                    var circles = svg.append("g").selectAll("g");

                    // If something is selected and you move the mouse
                    svg.on("mousemove", function() {
                        // If a circle is selected lets move it
                        if(circleToMoveData != null) {
                            var mouse = d3.mouse(this);
                            console.log(circleToMoveData);
                            circleToMoveData.x = mouse[0];
                            circleToMoveData.y = mouse[1];
                            update();
                        }
                    });

                    svg.on("mouseup", unselectCircle);

                    // If someone tries to delete something
                    d3.select("body").on("keydown", function(d) {
                        if(selectedCircle != undefined && selectedCircle != null) {
                            if (d3.event.keyCode == consts.DELETE_KEY) {
                                d3.event.preventDefault();

                                // TODO: delete nodeg
                            }
                        }
                    });

                    function unselectCircle() {
                        // Remove class from old selection if any
                        if(selectedCircle != undefined && selectedCircle != null)
                            selectedCircle.classed(consts.selectedClass, false);

                        selectedCircle = null;
                    }

                    // Update function, updating nodes and edges
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
                                circleToMoveData = d;
                            })
                            .on("mouseup", function(){
                                d3.event.stopPropagation();
                                circleToMoveData = null;

                                unselectCircle();

                                // Set the selected circle
                                selectedCircle = d3.select(this);
                                selectedCircle.classed(consts.selectedClass, true);
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