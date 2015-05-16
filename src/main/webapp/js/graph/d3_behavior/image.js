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

    d3.behavior.image = function() {
        // Custom events
        var event = d3_eventDispatch(image, "open", "close"),
            image_el = null,
            url;

        // Prototype method
        function image() {
            var that = this,
                dispatch = event.of(that, arguments);

            image_el = this
                .selectAll("image")
                .data([0])
                .enter()
                .append("svg:image")
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 100)
                .attr('height', 100)
                .attr('xlink:href', url);
        }

        image.updateImage = function(the_url) {
            url = the_url;

            if(image_el != null)
                image_el.attr('src', url);
        };

        return d3.rebind(image, event, "on");
    };

})();