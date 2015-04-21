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
                template: '<div class="graph" style="width: {{width}}; height: {{height}};" ng-transclude></div>',
                replace: true,
                transclude: true,

                scope: {
                    nodes: '=',
                    edges: '=',
                    width: '@',
                    height: '@',
                    nodeRadius: '@',
                    selectedClass: '@',
                    connectClass: '@',
                    circleWrapperClass: '@',
                    control: '='
                },

                // observe and manipulate the DOM
                link : function(scope, element, attrs) {
                    // Constants like classes and similar
                    var consts =  {
                        selectedClass: scope.selectedClass || "selected",
                        connectClass: scope.connectClass || "connect-node",
                        circleWrapperClass: scope.circleWrapperClass || "node",
                        nodeRadius: scope.nodeRadius || 20,
                        BACKSPACE_KEY: 8,
                        DELETE_KEY: 46
                    };

                    scope.safeApply = function(fn) {
                        var phase = this.$root.$$phase;
                        if(phase == '$apply' || phase == '$digest') {
                            if(fn && (typeof(fn) === 'function')) {
                                fn();
                            }
                        } else {
                            this.$apply(fn);
                        }
                    };

                    function removeNodeWithId(id) {
                        removeEdgeWithSourceOrTargetId(id);
                        scope.$apply(function() {
                            scope.nodes = _.reject(scope.nodes, function (obj) {
                                return obj.id == id;
                            });
                        });
                        update();
                    }

                    function removeEdgeWithSourceOrTargetId(id) {
                        scope.$apply(function() {
                            scope.edges = _.reject(scope.edges, function (obj) {
                                return obj.source.id == id || obj.target.id == id;
                            });
                        });
                        update();
                    }

                    function removeEdge(targetAndSourceID) {
                        scope.$apply(function() {
                            scope.edges = _.reject(scope.edges, function (obj) {
                                return obj.source.id == targetAndSourceID.source.id && obj.target.id == targetAndSourceID.target.id;
                            });
                        });
                        update();
                    }

                    function addEdge(source, target) {
                        scope.$apply(function() {
                            scope.edges.push({ "source": {"id": source}, "target": {"id": target} });
                        });
                        update();
                    }

                    function addNode(type, x, y) {
                        // Get a new unused id
                        var id = _.max(scope.nodes, function(node) { return node.id; }).id + 1;

                        // Get the translation occurring because of zooming and dragging
                        var pos = zoom.translate();
                        x -= pos[0];
                        y -= pos[1];

                        // Add the node
                        scope.safeApply(function() {
                            scope.nodes.push({"type": type, "id": id, "x": x, "y": y});
                        });
                        update();
                    }

                    scope.internalControl = scope.control || {};
                    scope.internalControl.addNode = addNode;

                    // Selected circle / edge
                    var selectedItem = null;
                    var selectedItemType = "circle";

                    function selectItem(itemToSelect, type) {
                        // Unselect old circle
                        unselectItem();

                        // Set the selected circle
                        selectedItem = itemToSelect;
                        selectedItemType = type || "circle";
                        selectedItem.classed(consts.selectedClass, true);
                    }

                    function unselectItem() {
                        // Remove class from old selection if any
                        if(itemIsSelected())
                            selectedItem.classed(consts.selectedClass, false);

                        selectedItem = null;
                        selectedItemType = null;
                    }

                    function deleteSelectedItem() {
                        // Keep a copy of the circle data to delete before unselecting it
                        var data = selectedItem[0][0].__data__;

                        if(selectedItemType == "edge")
                        {
                            unselectItem();
                            removeEdge(data);
                        }
                        else
                        {
                            unselectItem();
                            removeNodeWithId(data.id);
                        }
                    }

                    function itemIsSelected() {
                        return selectedItem != undefined && selectedItem != null;
                    }

                    // Create the svg element
                    var svg = d3.select(element[0])
                        .append("svg")
                        .attr("width", "100%")
                        .attr("height", "100%");

                    var container = svg.append("g");

                    // Watch angular properties for changes
                    // trigger an update if they do change
                    scope.$watchCollection('nodes', update, true);
                    scope.$watchCollection('edges', update, true);

                    // svg nodes and edges
                    var paths = container.append("g").selectAll("g");
                    var circles = container.append("g").selectAll("g");

                    // define arrow markers for graph links
                    var defs = svg.append('svg:defs');
                    defs.append('svg:marker')
                        .attr('id', 'end-arrow')
                        .attr('viewBox', '0 -5 10 10')
                        .attr('refX', "17")
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

                    var dragLine = container.append('svg:path')
                        .attr('class', 'link dragline hidden')
                        .attr('d', 'M0,0L0,0')
                        .style('marker-end', 'url(#mark-end-arrow)');

                    svg.on("mouseup", unselectItem);

                    // If someone tries to delete something
                    d3.select("body").on("keydown", function(d) {
                        if (d3.event.keyCode == consts.BACKSPACE_KEY && d3.event.shiftKey
                            || d3.event.keyCode == consts.DELETE_KEY) {
                            d3.event.preventDefault();

                            if(itemIsSelected())
                                deleteSelectedItem();
                        }
                    });

                    var shiftNodeDrag = false;
                    var drag = d3.behavior.drag()
                        .origin(function(d) { return d; })
                        .on("dragstart", function() {
                            d3.event.sourceEvent.stopPropagation();
                            shiftNodeDrag = d3.event.sourceEvent.shiftKey;
                        })
                        .on("drag", function(d) {
                            if(shiftNodeDrag) {
                                dragLine.classed('hidden', false);
                                dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(container.node())[0] + ',' + d3.mouse(container.node())[1]);
                            } else {
                                d.x = d3.event.x;
                                d.y = d3.event.y;
                            }
                            update();
                        })
                        .on("dragend", function(element) {
                            dragLine.classed('hidden', true);
                            if(shiftNodeDrag) {
                                var pos = d3.mouse(container.node());
                                var el = _.find(scope.nodes, function(itm) {
                                    var diffX = itm.x - pos[0];
                                    var diffY = itm.y - pos[1];
                                    var length = Math.sqrt(diffX*diffX+diffY*diffY);
                                    return length <= consts.nodeRadius;
                                });
                                if(el != undefined && el != null && el.id != element.id) {
                                    addEdge(element.id, el.id);
                                }
                            }
                        });

                    // Add zoom and pan to the container
                    var zoom = d3.behavior.zoom()
                        .scaleExtent([0.1, 10])
                        .on("zoom", function() {
                            container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                        });
                    svg.call(zoom);

                    // Update function, updating nodes and edges
                    function update() {
                        function transformFunction(d){return "translate(" + d.x + "," + d.y + ")";}

                        // update existing paths
                        paths = paths.data(scope.edges, function(d){ return "" + d.source.id + "+" + d.target.id; });

                        function d(d) {
                            var source = _.findWhere(scope.nodes, { id: d.source.id });
                            var target = _.findWhere(scope.nodes, { id: d.target.id });
                            return "M" + source.x + "," + source.y + "L" + target.x + "," + target.y;
                        }

                        paths.style('marker-end', 'url(#end-arrow)')
                            .attr("d", d);

                        // add new paths
                        paths.enter()
                            .append("path")
                            .style('marker-end','url(#end-arrow)')
                            .classed("link", true)
                            .attr("d", d)
                            .on("click", function() {
                                selectItem(d3.select(this), "edge");
                            });

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
                        newCircleWrappers
                            .attr('class', function(d) { return d.type + " " + consts.circleWrapperClass; })
                            .attr("transform", transformFunction)
                            .on("click", function() {
                                selectItem(d3.select(this), "circle");
                            })
                            .call(drag);

                        newCircleWrappers
                            .append("circle")
                            .attr("r", String(consts.nodeRadius))
                            .attr("tooltip-append-to-body", true)
                            .attr("tooltip-placement", "right")
                            .attr("tooltip", function(){
                                return "Hello World";
                            })

                        newCircleWrappers
                            .append('text')
                            .attr('font-family', 'FontAwesome')
                            .attr('font-size', function(d) { return 1.8 +'em'} )
                            .attr("dy", function(d){return consts.nodeRadius/2})
                            .attr("text-anchor", "middle")
                            .attr('fill', 'white')
                            .text(function(d) {
                                switch(d.type) {
                                    case 'train':
                                        return '\uf238';
                                        break;

                                    case 'bus':
                                        return '\uf207';
                                        break;

                                    case 'desktop':
                                        return '\uf108';
                                        break;

                                    case 'arrows-h':
                                        return '\uf07e';
                                        break;

                                    case 'suitcase':
                                        return '\uf0f2';
                                        break;

                                    default:
                                        return '\uf118';
                                }
                            });

                        // remove old nodes
                        circles.exit().remove();
                    }
                    update();
                }
            }
        }]);
})();