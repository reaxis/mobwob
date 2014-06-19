require.config({
	paths: {
		zepto: "libs/zepto.min",
		underscore: "libs/underscore-min",
		backbone: "libs/backbone-min"
	},
	shim: {
		zepto: {exports: "$"},
		underscore: {exports: "_"},
		backbone: {
			deps: ["zepto", "underscore"],
			exports: "Backbone"
		}
	}
});

var appView;

require(["zepto", "backbone", "models", "views"], function($, Backbone, Models, Views) {
	"use strict";

/******************************************************************************/

	$.fn.redraw = function() {
		$(this).each(function() {
			var redraw = this.offsetHeight;
		});

		return this;
	};

	// open a page
	var showPage = function(id) {
		if ($("#" + id).length && $("section.current").attr("id") !== id) {
			var isBack = linkClicked ? false : true;
			linkClicked = false;

			var $current = $("section.current");

			if (!$("body").hasClass("debug")) {
				if (isBack) {
					$("#" + id).css("display", "block").addClass("back").redraw().addClass("current");
				} else {
					$("#" + id).css("display", "block").redraw().addClass("current");
				}
			} else {
				$("#" + id).addClass("current");
			}

			$current.removeClass("current back");

			setTimeout(function() {
				if (!$("body").hasClass("debug")) {
					$current.css("display", "none");
				}
			}, 700);

			$("body").removeClass("out");
		}
	}

	var Router = Backbone.Router.extend({
		routes: {
			"": "home",
			"debug/on": "debugOn",
			"debug/off": "debugOff",
			":id": "page"
		},
		home: function() {
			showPage("home");
		},
		page: function(id) {
			showPage(id);
		},
		debugOn: function() {
			$("body").addClass("debug");
		},
		debugOff: function() {
			$("body").removeClass("debug");
		}
	}),

	router = new Router(),

	appView = new Views.AppView();

	Backbone.history.start();

	var linkClicked = false;

	// prevent empty links from doing anything
	$("a").on("click", function(e) {
		if ($(this).attr("href") === "#") {
			e.preventDefault();
		} else {
			linkClicked = true;
		}
	});

	// back button should do what back buttons do
	$("header .button.back").on("click", function(e) {
		e.preventDefault();
		window.history.back();
	});

	$("section.current").css("display", "block");

/******************************************************************************/

	$("body").on("click", ".sidetoggle", function() {
		$("body").toggleClass("out");
	});

/******************************************************************************/

	var sideWidth = $("nav").width(),
		touchStarted = false, 
		swipe = false,
		swipeX = 0,
		touchX = 0,
		relative = 0;

	$("body").on("touchstart", "section.current", function(e) {
		swipeX = $("body").hasClass("out") ? sideWidth : 0;
		touchX = e.touches[0].pageX;
		relative = touchX - swipeX;
	});

	$("body").on("touchmove", function(e) {
		if (Math.abs(touchX - e.touches[0].pageX) > 10) {
			swipe = true;
		}

		if (swipe) {
			e.preventDefault();

			$("body").removeClass("animate");

			swipeX = e.touches[0].pageX - relative;
			swipeX = (swipeX > sideWidth) ? sideWidth : ((swipeX) < 0 ? 0 : swipeX);

			$("section.current").css("-webkit-transform", "translate3d(" + swipeX + "px, 0, 0)");
			$("section.current").css("transform", "translate3d(" + swipeX + "px, 0, 0)");

			$("nav").css("-webkit-transform", "translate3d(" + (swipeX*(20/sideWidth)-20) + "px, 0, 0)");
			$("nav").css("transform", "translate3d(" + (swipeX*(20/sideWidth)-20) + "px, 0, 0)");
		}
	});

	$("body").on("touchend touchcancel", function(e) {
		swipe = false;
		touchStarted = false;
		$("body").addClass("animate");

		if (swipeX > 125) {
			$("body").addClass("out");
		} else {
			$("body").removeClass("out");
		}
	});
});