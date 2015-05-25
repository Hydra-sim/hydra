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
                    control: '=',
                    extraTooltip: '&',
                    extraBorder: '&',
                    background: '='
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
                        DELETE_KEY: 46,
                        KEY_C: 67,
                        KEY_V: 86
                    };

                    var icons = {
                        'train' : {icon: '\uf238'},
                        'bus': {icon: '\uf207'},
                        'desktop': {icon: '\uf108'},
                        'door': {icon: '\ue001', font: 'Flaticon'},
                        'suitcase': {icon: '\uf0f2'},
                        'parking': {icon: 'P', font: 'Arial'},
                        'passengerflow': {icon: '\uf0c0'},
                        'consumerGroup-desktop': {icon: '\ue003', font: 'custom-font'},
                        'consumerGroup-suitcase': {icon: '\ue004', font: 'custom-font'}
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

                    function newId() {
                        // Get a new unused id
                        return (_.max(scope.nodes, function(node) { return node.id; }).id || 0) + 1;
                    }

                    function viewSpaceToWorldSpace(x, y) {
                        // Get the translation occurring because of zooming and dragging
                        var pos = zoom.translate();
                        var scale = zoom.scale();
                        x = (x - pos[0]) / scale;
                        y = (y - pos[1]) / scale;

                        return {'x': x, 'y': y};
                    }

                    function worldSpaceToViewSpace(x, y) {
                        var pos = zoom.translate();
                        var scale = zoom.scale();

                        return {
                            'x' : scale * x + pos[0],
                            'y' : scale * y + pos[1]
                        }
                    }

                    function addNode(type, x, y, data) {
                        // Get a new unused id
                        var id = newId();

                        var pos = viewSpaceToWorldSpace(x, y);

                        var newNode = {
                            "type": type,
                            "id": id,
                            "x": pos.x,
                            "y": pos.y
                        };
                        _.each(data, function(value, key) { newNode[key] = value; }); // Add the data to the element

                        // Add the node
                        scope.safeApply(function() {
                            scope.nodes.push(newNode);
                        });
                        update();
                    }

                    function getEdgeWithId(source, target) {
                        return _.find(scope.edges, function(d) { return d.source.id == source.id && d.target.id == target.id; });
                    }

                    function copyNode(data, x, y) {
                        var newNode = {};
                        _.each(data, function(value, key) { newNode[key] = value; }); // Add the data to the element

                        var pos = viewSpaceToWorldSpace(x, y);
                        newNode.id = newId();
                        newNode.x = pos.x;
                        newNode.y = pos.y;

                        // Add the node
                        scope.safeApply(function() {
                            scope.nodes.push(newNode);
                        });
                        update();
                    }

                    scope.internalControl = scope.control || {};
                    scope.internalControl.addNode = addNode;
                    scope.internalControl.update = update;

                    // Selected circle / edge
                    var selectedItem = null;
                    var selectedItemType = "circle";
                    var itemToCopy = null;

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

                    function selectedElementData() {
                        return selectedItem[0][0].__data__;
                    }

                    function deleteSelectedItem() {
                        // Keep a copy of the circle data to delete before unselecting it
                        var data = selectedElementData();

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

                    var imageContainer = container.append("g");

                    // Watch angular properties for changes
                    // trigger an update if they do change
                    scope.$watchCollection('nodes', update, true);
                    scope.$watchCollection('edges', update, true);

                    // Setup for tooltip
                    var tooltip = null;
                    scope.$watch('extraTooltip', function() {
                        tooltip = scope.extraTooltip();
                        update();
                    });

                    // Setup for border
                    var border = null;
                    scope.$watch('extraBorder', function() {
                        border = scope.extraBorder();
                        update();
                    });

                    // svg nodes and edges
                    var paths = container.append("g").selectAll("g");
                    var circles = container.append("g").selectAll("g");

                    // define arrow markers for graph links
                    var defs = svg.append('svg:defs');
                    defs.append('svg:marker')
                        .attr('id', 'end-arrow')
                        .attr('viewBox', '0 -5 10 10')
                        .attr('refX', "17")
                        .attr('markerWidth', 6)
                        .attr('markerHeight', 6)
                        .attr('orient', 'auto')
                        .append('svg:path')
                        .attr('d', 'M0,-5L10,0L0,5');

                    // define arrow markers for leading arrow
                    defs.append('svg:marker')
                        .attr('id', 'mark-end-arrow')
                        .attr('viewBox', '0 -5 10 10')
                        .attr('refX', 7)
                        .attr('markerWidth', 6)
                        .attr('markerHeight', 6)
                        .attr('orient', 'auto')
                        .append('svg:path')
                        .attr('d', 'M0,-5L10,0L0,5');

                    var dragLine = container.append('svg:path')
                        .attr('class', 'link dragline hidden')
                        .attr('d', 'M0,0L0,0')
                        .style('marker-end', 'url(#mark-end-arrow)');

                    svg.on("mouseup", unselectItem);

                    // Temporary saving the mouse position to use when you copy-paste a node
                    var tmpLastMousePos = null;
                    svg.on("mousemove", function() { tmpLastMousePos = d3.mouse(this); });

                    // If someone tries to delete something
                    d3.select("body").on("keydown", function(d) {
                        if (d3.event.keyCode == consts.BACKSPACE_KEY && d3.event.shiftKey
                            || d3.event.keyCode == consts.DELETE_KEY) {
                            d3.event.preventDefault();

                            if(itemIsSelected())
                                deleteSelectedItem();
                        }
                        else if (d3.event.keyCode == consts.KEY_C && d3.event.ctrlKey) {
                            if(itemIsSelected()) {
                                itemToCopy = selectedElementData();
                                unselectItem();
                                console.log("copied element", itemToCopy);
                            }

                        }
                        else if (d3.event.keyCode == consts.KEY_V && d3.event.ctrlKey) {
                            if(itemToCopy != null) {
                                console.log("paste", itemToCopy);
                                copyNode(itemToCopy, tmpLastMousePos[0], tmpLastMousePos[1]);
                            }
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

                    //Add image handeling
                    var bg = d3.behavior.image();

                    scope.$watch('background', function(img) {
                        if(typeof img != 'undefined' && img != null)
                            bg.updateImage(img);
                    }, true);

                    imageContainer.call(bg);


                    //Tooltip for weigting
                    var tooltip_weighting = d3.behavior.tooltip()
                        .text(function(d) {
                            //console.log(d);
                            if(typeof d.weight == 'undefined') {
                                return "0%";
                            }

                            return d.weight + "%";
                        })
                        .setParent(element[0])
                        .setPosition(function(d) {
                            var source = _.find(scope.nodes, function(node) { return node.id == d.source.id; });
                            var target = _.find(scope.nodes, function(node) { return node.id == d.target.id; });

                            var dx = (source.x + target.x)/2;
                            var dy = (source.y + target.y)/2 + 18;

                            return worldSpaceToViewSpace(dx, dy);
                        });

                    var tmp_start_weight;
                    var tooltip_drag = d3.behavior.drag()
                        .on('dragstart', function(d) {
                            tmp_start_weight = d.weight || 0;
                        })
                        .on('drag', function(edge) {
                            var pos = d3.mouse(this);
                            edge.weight = tmp_start_weight + ~~(pos[0]/3);
                            edge.weight = edge.weight >= 0 ? edge.weight : 0;
                            edge.weight = edge.weight > 100 ? 100 : edge.weight;
                            console.log(edge.weight);
                            //tooltip_weighting.open(edge);
                            update();
                        })
                        .on('dragend', function() {
                            //tooltip_weighting.close();
                        });

                    tooltip_weighting.callOn(tooltip_drag);

                    // Update function, updating nodes and edges
                    function update() {
                        function transformFunction(d){return "translate(" + d.x + "," + d.y + ")";}

                        // update existing paths
                        paths = paths.data(scope.edges || [], function(d){ return "" + d.source.id + "+" + d.target.id; });

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
                            })
                            .call(tooltip_weighting);

                        // remove old links
                        paths.exit().remove();

                        // update existing nodes
                        circles = circles.data(scope.nodes || [], function(d){ return d.id; });
                        circles.attr("transform", transformFunction);


                        if(border != null)
                            circles.selectAll("circle").call(border);

                        // add new nodes
                        var newCircleWrappers = circles
                            .enter()
                            .append("g");


                        newCircleWrappers
                            .attr('class', function(d) { return d.type + " " + consts.circleWrapperClass; })
                            .attr("transform", transformFunction)
                            .on("click", function() {
                                selectItem(d3.select(this), "circle");
                            })
                            .call(drag);

                        if(tooltip != null) {
                            tooltip
                                .setParent(element[0])
                                .setPosition(function(d) { return worldSpaceToViewSpace(d.x, d.y); });

                            newCircleWrappers.call(tooltip);
                        }

                        newCircleWrappers
                            .append("circle")
                            .attr("r", String(consts.nodeRadius));

                        newCircleWrappers
                            .append('text')
                            .attr('font-family', function(d) {
                                return icons[d.type].font || 'FontAwesome' ;
                            })
                            .attr('font-size', function(d) {
                                return 1.4 +'em'
                            } )
                            .attr("text-anchor", "middle")
                            .attr("alignment-baseline", "central")
                            .attr('fill', 'white')
                            .text(function(d) {
                                return icons[d.type].icon || '\uf118';
                            });

                        // remove old nodes
                        circles.exit().remove();

                    }
                    update();
                }
            }
        }]);
})();