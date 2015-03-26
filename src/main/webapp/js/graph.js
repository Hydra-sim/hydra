(function() {
    'use strict';

    // Dependent on angular, D3 an underscore.js
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
                    circleWrapperClass: '='
                },

                // observe and manipulate the DOM
                link : function(scope, element, attrs) {
                    // Constants like classes and similar
                    var consts =  {
                        selectedClass: scope.selectedClass || "selected",
                        connectClass: scope.connectClass || "connect-node",
                        circleWrapperClass: scope.circleWrapperClass || "node",
                        nodeRadius: scope.nodeRadius || 20,
                        BACKSPACE_KEY: 8
                    };

                    function removeNodeWithId(id) {
                        removeEdgeWithSourceOrTargetId(id);
                        scope.nodes = _.reject(scope.nodes, function(obj) { return obj.id == id; });
                        update();
                    }

                    function removeEdgeWithSourceOrTargetId(id) {
                        scope.edges = _.reject(scope.edges, function(obj) {
                            return obj.source == id || obj.target == id;
                        });
                        update();
                    }

                    // Selected circle
                    var selectedCircle = null;

                    function selectCircle(circleToSelect) {
                        // Unselect old circle
                        unselectCircle();

                        // Set the selected circle
                        selectedCircle = circleToSelect;
                        selectedCircle.classed(consts.selectedClass, true);
                    }

                    function unselectCircle() {
                        // Remove class from old selection if any
                        if(circleIsSelected())
                            selectedCircle.classed(consts.selectedClass, false);

                        selectedCircle = null;
                    }

                    function deleteSelectedCircle() {
                        // Keep a copy of the circle data to delete before unselecting it
                        var data = selectedCircle[0][0].__data__;
                        unselectCircle();
                        removeNodeWithId(data.id);
                    }

                    function circleIsSelected() {
                        return selectedCircle != undefined && selectedCircle != null;
                    }

                    // Circle to move
                    var circleToMove = null;

                    function setCircleToMove(circle) {  circleToMove = circle; }
                    function resetCricleToMove() {  circleToMove = null; }
                    function circleToMoveNotEmpty() { return circleToMove != null; }

                    // data = [0: x, 1: y]
                    function setCircleToMovePosition(data) {
                        circleToMove.x = data[0];
                        circleToMove.y = data[1];
                    }

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

                    // define arrow markers for graph links
                    var defs = svg.append('svg:defs');
                    defs.append('svg:marker')
                        .attr('id', 'end-arrow')
                        .attr('viewBox', '0 -5 10 10')
                        .attr('refX', "32")
                        .attr('markerWidth', 3.5)
                        .attr('markerHeight', 3.5)
                        .attr('orient', 'auto')
                        .append('svg:path')
                        .attr('d', 'M0,-5L10,0L0,5');

                    // define arrow markers for leading arrow
                    defs.append('svg:marker')
                        .attr('id', 'mark-end-arrow')
                        .attr('viewBox', '0 -5 10 10')
                        .attr('refX', 7)
                        .attr('markerWidth', 3.5)
                        .attr('markerHeight', 3.5)
                        .attr('orient', 'auto')
                        .append('svg:path')
                        .attr('d', 'M0,-5L10,0L0,5');

                    // If something is selected and you move the mouse
                    svg.on("mousemove", function() {
                        // If a circle is selected lets move it
                        if(circleToMoveNotEmpty()) {
                            setCircleToMovePosition(d3.mouse(this));
                            update();
                        }
                    });

                    svg.on("mouseup", unselectCircle);

                    // If someone tries to delete something
                    d3.select("body").on("keydown", function(d) {
                        if (d3.event.keyCode == consts.BACKSPACE_KEY) {
                            d3.event.preventDefault();

                            if(circleIsSelected())
                                deleteSelectedCircle();
                        }
                    });

                    // Update function, updating nodes and edges
                    function update() {
                        function transformFunction(d){return "translate(" + d.x + "," + d.y + ")";}

                        // update existing paths
                        paths = paths.data(scope.edges, function(d){ return "" + d.source + "+" + d.target; });

                        function d(d) {
                            var source = _.findWhere(scope.nodes, { id: d.source });
                            var target = _.findWhere(scope.nodes, { id: d.target });
                            return "M" + source.x + "," + source.y + "L" + target.x + "," + target.y;
                        }

                        paths.style('marker-end', 'url(#end-arrow)')
                            .attr("d", d);

                        // add new paths
                        paths.enter()
                            .append("path")
                            .style('marker-end','url(#end-arrow)')
                            .classed("link", true)
                            .attr("d", d);

                        // remove old links
                        paths.exit().remove();

                        // update existing nodes
                        circles = circles.data(scope.nodes, function(d){ return d.id; });
                        circles.attr("transform", transformFunction);

                        // add new nodes
                        var newCircleWrappers = circles
                            .enter()
                            .append("g");

                        newCircleWrappers
                            .attr('class', function(d) { return d.type + " " + consts.circleWrapperClass; })
                            .attr("transform", transformFunction)
                            .on("mousedown", setCircleToMove)
                            .on("mouseup", function(){
                                d3.event.stopPropagation();
                                resetCricleToMove();
                                selectCircle(d3.select(this));
                            });

                        newCircleWrappers
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