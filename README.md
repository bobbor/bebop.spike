# bebop.spike

## bebop?

[bebop][1] is a small framework for DOM-Manipulation and AJAX.  
It also has support for Promises.

## About

Backbone uses jQuery per default as tool for DOM-Traversal, Event-Binding and AJAX.  
But I want to use bebop.

In the Backbone wiki exists a page which describes what is required to replace jQuery.  
[Using Backbone without jQuery][2]

So this is basically an implementation for [bebop][1]

---

## Install

just clone this repo or

    bower i bebop.spike

## Usage

HTML

	<script src="bebop.spike/view.js"></script>

or via amd

	define ['bebop.spike/view'], (view) ->
	  // logic here

since this is a Backbone.View, it can be used as you would expect

	myView = bebop.spike.extend {
		events: 
			'click': 'onClick'
		initialize: ->
			# init here
		onClick: (e) ->
			# handle click
	}

## Note

This exports an *alternative* Backbone.View and does **NOT** replace the original one.

If you want to do that, you have to do it your self.

	Backbone.View = bebop.spike;
	

[1]: http://www.github.com/bobbor/bebop
[2]: https://github.com/jashkenas/backbone/wiki/Using-Backbone-without-jQuery