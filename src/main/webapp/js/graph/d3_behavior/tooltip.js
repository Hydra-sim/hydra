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
            tooltip_el = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .style("background", "#1d1d1d")
                .style("box-shadow", "0 0 5px #999999")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("color", "white");

        // Prototype method
        function tooltip() {
            var that = this,
                dispatch = event.of(that, arguments);

            this
                .on("mouseover", function(){
                    dispatch({type: "open"});
                    open();
                })
                .on("mousemove", function(d){
                    tooltip_el
                        .style("top", (d3.event.pageY-10)+"px")
                        .style("left",(d3.event.pageX+10)+"px")
                        .html(text_method(d));
                })
                .on("mouseout", function(){
                    dispatch({type: "close"});
                    close();
                });
        }

        // Custom methods
        tooltip.text = function(method) {
            text_method = method;
            return tooltip;
        };

        tooltip.open = open;
        function open() {
            tooltip_el.style("visibility", "visible");
        }

        tooltip.close = close;
        function close() {
            tooltip_el.style("visibility", "hidden");
        }

        return d3.rebind(tooltip, event, "on");
    };

})();