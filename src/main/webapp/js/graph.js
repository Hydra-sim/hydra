(function() {

    'use strict';

    angular
        .module('graph', [])
        .directive('graph', [function() {
            var width  = 960,
                height = 500,
                fill = d3.scale.category20();

            return {
                // required to make it work as an element
                restrict: 'E',

                // replace <graph> with this html
                template: '<div class="graph"></div>',
                replace: true,

                // observe and manipulate the DOM
                link : function(scope, element, attrs) {
                    var svg = d3.select(element[0]).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .on("mousemove", mousemove)
                        .on("mousedown", mousedown);

                    var force = d3.layout.force()
                        .size([width, height])
                        .nodes([{}]) // initialize with a single node
                        .linkDistance(30)
                        .charge(-60)
                        .on("tick", tick);

                    svg.append("rect")
                        .attr("width", width)
                        .attr("height", height);

                    var nodes = force.nodes(),
                        links = force.links(),
                        node = svg.selectAll(".node"),
                        link = svg.selectAll(".link");

                    var cursor = svg.append("circle")
                        .attr("r", 30)
                        .attr("transform", "translate(-100,-100)")
                        .attr("class", "cursor");

                    restart();

                    function mousemove() {
                        cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
                    }

                    function mousedown() {
                        var point = d3.mouse(this),
                            node = {x: point[0], y: point[1]},
                            n = nodes.push(node);

                        // add links to any nearby nodes
                        nodes.forEach(function(target) {
                            var x = target.x - node.x,
                                y = target.y - node.y;
                            if (Math.sqrt(x * x + y * y) < 30) {
                                links.push({source: node, target: target});
                            }
                        });

                        restart();
                    }

                    function tick() {
                        link.attr("x1", function(d) { return d.source.x; })
                            .attr("y1", function(d) { return d.source.y; })
                            .attr("x2", function(d) { return d.target.x; })
                            .attr("y2", function(d) { return d.target.y; });

                        node.attr("cx", function(d) { return d.x; })
                            .attr("cy", function(d) { return d.y; });
                    }

                    function restart() {
                        link = link.data(links);

                        link.enter().insert("line", ".node")
                            .attr("class", "link");

                        node = node.data(nodes);

                        node.enter().insert("circle", ".cursor")
                            .attr("class", "node")
                            .attr("r", 5)
                            .call(force.drag);

                        force.start();
                    }
                }
            }
        }]);
})();