(function() {

    "use strict";

    // internal function in d3: returns closures which call callbacks
    function d3_dispatch_event(dispatch) {
        var listeners = [], listenerByName = d3.map();
        function event() {
            var z = listeners, i = -1, n = z.length, l;
            while (++i < n) if (l = z[i].on) l.apply(this, arguments);
            return dispatch;
        }
        event.on = function(name, listener) {
            var l = listenerByName.get(name), i;
            if (arguments.length < 2) return l && l.on;
            if (l) {
                l.on = null;
                listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
                listenerByName.remove(name);
            }
            if (listener) listeners.push(listenerByName.set(name, {on: listener}));
            return dispatch;
        };
        return event;
    }
    // internal function in d3: returns d3.dispatch object, which remembers target
    function d3_eventDispatch(target) {
        var dispatch = d3.dispatch(), i = 0, n = arguments.length;
        while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
        dispatch.of = function(thiz, argumentz) {
            return function(e1) {
                try {
                    var e0 = e1.sourceEvent = d3.event;
                    e1.target = target;
                    d3.event = e1;
                    dispatch[e1.type].apply(thiz, argumentz);
                } finally {
                    d3.event = e0;
                }
            };
        };
        return dispatch;
    }
    // end of internal functions

    d3.behavior.tooltip = function() {
        // Custom events
        var event = d3_eventDispatch(tooltip, "open", "close");

        var text_method = function() {},
            tooltip_el = null,
            parent = null,
            position = function() { return {x:0, y:0}; },
            dispatch,
            callOn = null;

        // Prototype method
        function tooltip(selection) {
            selection.each(function(i) {

                var that = this;
                dispatch = event.of(that, arguments);
                var tooltip_el;

                if(parent != null) {
                    tooltip_el = d3.select(parent)
                        .selectAll("div.d3BehaviorTooltipWrapper")
                        .data([i]);

                    tooltip_el
                        .enter()
                        .append("div.d3BehaviorTooltipWrapper")
                        .attr("class", "d3BehaviorTooltipWrapper")
                        .style("visibility", "hidden");

                    tooltip_el
                        .append("div")
                        .attr("class", "d3BehaviorTooltip");
                }

                if(tooltip_el != null) {
                    tooltip_el
                        .on("mouseover", function() { open(); })
                        .on("mouseout", close);

                    if(callOn != null)
                        tooltip_el.call(callOn);
                }

                d3.select(this)
                    .on("mouseover", function() { open(); })
                    .on("mouseout", close)
                    .on("mousemove", function(d){
                        var pos = position(d);

                        tooltip_el
                            .style("left",pos.x+"px")
                            .style("top", pos.y+"px")
                            .selectAll("div")
                            .html(text_method(d));
                    });

                function close() {
                    dispatch({type: "close"});
                    tooltip_el.style("visibility", "hidden");
                }

                function open(d) {
                    dispatch({type: "open"});
                    tooltip_el.style("visibility", "visible");

                    if(typeof d != 'undefined' && d != null)
                        tooltip_el.selectAll("div")
                            .html(text_method(d));
                }
            });
        }

        // Custom methods
        tooltip.text = function(method) {
            text_method = method;
            return tooltip;
        };

        tooltip.setParent = function(p) {
            parent = p;
            return tooltip;
        };

        tooltip.setPosition = function(func) {
            position = func;
            return tooltip;
        };

        tooltip.callOn = function(co) {
            callOn = co;
            return tooltip;
        };

        return d3.rebind(tooltip, event, "on");
    };

})();