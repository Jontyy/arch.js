(function(arch){
	"use strict";
	var module = {},

	modules = {},

	constructors = {},

	//shortcut for throwng an error
		error = function(message){
			throw new Error(message);
		};

	module.register = function(/*string*/ name, /*function*/ constructor){
		typeof name !== 'string' && error('Module name must be a string.');
		typeof constructor !== 'function' && error('Module constructor must be a function.');
		
		constructors[name] = constructor;

	};
	module.start = function(/*string*/ name){
		var i,m,elem;
		for(i in arguments){if(arguments.hasOwnProperty(i)){
			if(typeof arguments[i] !== 'string'){
				error('Module names must be strings.');
			}
			if(typeof constructors[arguments[i]] !== 'function'){
				error('Module not found.');
			}
			m = constructors[arguments[i]];
			elem = document.getElementById(arguments[i])
			m = m.call(elem, new arch.Sandbox(elem));
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