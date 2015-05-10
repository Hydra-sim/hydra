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

    d3.behavior.border = function() {
        var event = d3_eventDispatch(border, "update"),
            bordercolor = null,
            borderwidth = null;

        function border(selection) {
            selection.each(function(i) {
                var dispatch = event.of(this, arguments);

                d3.select(this).style("stroke", bordercolor);
                d3.select(this).style("stroke-width", borderwidth);

                dispatch({type: "update"});
            });
        }

        border.color = function(color) {
            bordercolor = color;
            return border;
        };

        border.width = function(w) {
            borderwidth = w;
            return border;
        };

        return d3.rebind(border, event, "on");
    }

})();