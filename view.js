// Uses AMD or browser globals to create a module. This example creates a
// global even when AMD is used. This is useful if you have some scripts
// that are loaded by an AMD loader, but they still want access to globals.
// for ref: https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['backbone', 'underscore', 'bebop'], function (Backbone, _, bebop) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (bebop.spike = factory(Backbone, _, bebop));
        });
    } else {
        // Browser globals
        bebop.spike = factory(root.Backbone, root._, root.bebop);
    }
}(self, function (Backbone, _, $) {
    'use strict';
    var hasOwn = {}.hasOwnProperty;
    var eventMap = {};

    var View = {
        // the "$" function
        $: function (sel) {
            return this.$el.all(sel);
        },
        // removing an element is extremely simple
        _removeElement: function () {
            this.$el.remove();
        },
        // delegate = simple event binding
        delegate: function (eventName, selector, listener) {
            selector = selector || '';
            var k = eventName + '.delegateEvents' + this.cid + ':' + selector;
            var proxylistener = function () {
                return listener.apply(this, arguments);
            };
            eventMap[k] = proxylistener;
            this.$el.on(eventName, proxylistener, selector);
        },
        // undelegate = removing single events
        undelegate: function (eventName, selector) { // don't need listener here, as identification is done via selector
            selector = selector || '';
            var k = eventName + '.delegateEvents' + this.cid + ':' + selector;
            var fn = eventMap[k];
            if (fn) {
                this.$el.off(eventName, fn);
                delete eventMap[k];
            }
        },
        // undelegateEvents = removing all events
        undelegateEvents: function () {
            var that = this;
            if (this.el) {
                _.chain(eventMap)
                    .keys()
                    .filter(function (key) {
                        return key.indexOf('.delegateEvents' + that.cid) !== -1;
                    })
                    .forEach(function (event) {
                        var name = event.replace(/\.delegateEvents(.*)$/g, '');
                        var fn = eventMap[event];
                        that.$el.off(name, fn);
                        delete eventMap[event];
                    });
            }
            return this;
        },
        // setting the Element `this.el` of the view
        _setElement: function (el) {
            this.$el = $.one(el);
            this.el = this.$el._node;
        },
        // setting Attributes - passed in the view
        _setAttributes: function (attributes) {
            for (var attr in attributes) {
                if (hasOwn.call(attributes, attr)) {
                    this.$el.attr(attr, attributes[attr]);
                }
            }
        }
    };
    return Backbone.View.extend(View);
}));