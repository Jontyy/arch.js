(function(arch){
	"use strict";
	var module = {},

	modules = {},

	pending = {},

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
		pending[name] = {
			status : false,
			constructor : constructor,
			elem : elem
		};

	};
	module.start = function(/*string*/ name){
		var i,m;
		for(i in arguments){if(arguments.hasOwnProperty(i)){
			if(typeof arguments[i] !== 'string'){
				error('Module names must be strings.');
			}
			if(typeof pending[arguments[i]] !== 'object'){
				error('Module not found.');
			}
			m = pending[arguments[i]];
			m = m.constructor.call(m.elem);
			if(typeof m !== 'object' || typeof m.init !== 'function' || typeof m.destroy !== 'function'){
				error('Module constructor should return an object with init and destroy methods.');
			}
			m.init();
			modules[arguments[i]] = m;	
		}}
	};
	module.stop = function(/*string*/ name){};
	module.startAll = function(){};
	module.stopAll = function(){};

	arch.module = module;
}(window.arch));