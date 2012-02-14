(function(arch){
	"use strict";
	var module = {},

	//shortcut for throwng an error
		error = function(message){
			throw new Error(message);
		};

	module.register = function(/*string*/ name, /*function*/ constructor){
		typeof name !== 'string' && error('Module name must be a string.');
		typeof constructor !== 'function' && error('Module constructor must be a function.');
		var elem = document.getElementById(name);
		if(!elem || !elem.nodeType || elem.nodeType !== 1){
			error('Module name must be an id of an element.');
		}
	};
	module.start = function(/*string*/ name){};
	module.stop = function(/*string*/ name){};
	module.startAll = function(){};
	module.stopAll = function(){};

	arch.module = module;
}(window.arch));