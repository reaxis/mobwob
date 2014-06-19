define(["underscore", "backbone"], function(_, Backbone) {
	"use strict";

	var AppView = Backbone.View.extend({
		el: "#side",
		events: {
		},
		initialize: function() {
		},
		render: function() {	
		}
	}),

	PageView = Backbone.View.extend({
		el: ".page",
		template: _.template($("#page_layout").text()),
		events: {
		},
		initialize: function() {
		},
		render: function() {

		}
	});

	return {
		AppView: AppView,
		PageView: PageView
	};
});