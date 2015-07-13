// we have to overwrite [certain functions](https://github.com/jashkenas/backbone/wiki/Using-Backbone-without-jQuery)
// to allow backbone to work without jquery
(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore', 'dom'], function () {
            factory.apply(root, arguments);
        });
    } else {
        factory(root.Backbone, root._, root.DOM);
    }
}(this, function(Backbone, _, $) {
    'use strict';
    var hasOwn = {}.hasOwnProperty;
    var eventMap = {};

    var View = {
        // the "$" function
        $                : function(sel) {
            return this.$el.all(sel);
        },
        // removing an element is extremely simple
        _removeElement   : function() {
            this.$el.remove();
        },
        // delegate = simple event binding
        delegate         : function(eventName, selector, listener) {
            selector = selector || '';
            var k = eventName + '.delegateEvents' + this.cid + ':' + selector;
            var proxylistener = function() {
                return listener.apply(this, arguments);
            };
            eventMap[k] = proxylistener;
            this.$el.on(eventName, proxylistener, selector);
        },
        // undelegate = removing single events
        undelegate       : function(eventName, selector) { // don't need listener here, as identification is done via selector
            selector = selector || '';
            var k = eventName + '.delegateEvents' + this.cid + ':' + selector;
            var fn = eventMap[k];
            if (fn) {
                this.$el.off(eventName, fn);
                delete eventMap[k];
            }
        },
        // undelegateEvents = removing all events
        undelegateEvents : function() {
            var that = this;
            if (this.el) {
                _.chain(eventMap)
                    .keys()
                    .filter(function(key) {
                        return key.indexOf('.delegateEvents' + that.cid) !== -1;
                    })
                    .forEach(function(event) {
                        var name = event.replace(/\.delegateEvents(.*)$/g, '');
                        var fn = eventMap[event];
                        that.$el.off(name, fn);
                        delete eventMap[event];
                    });
            }
            return this;
        },
        // setting the Element `this.el` of the view
        _setElement      : function(el) {
            this.$el = $.one(el);
            this.el = this.$el._node;
        },
        // setting Attributes - passed in the view
        _setAttributes   : function(attributes) {
            for (var attr in attributes) {
                if (hasOwn.call(attributes, attr)) {
                    this.$el.attr(attr, attributes[attr]);
                }
            }
        }
    };
    Backbone.View = Backbone.View.extend(View);
}));