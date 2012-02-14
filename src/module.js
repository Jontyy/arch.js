(function(arch){
	"use strict";
	var module = {};

	module.register = function(/*string*/ name, /*function*/ constructor){};
	module.start = function(/*string*/ name){};
	module.stop = function(/*string*/ name){};
	module.startAll = function(){};
	module.stopAll = function(){};

	arch.module = module;
}(window.arch));