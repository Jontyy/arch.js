(function(arch) {
	"use strict";
	var module = {},

		modules = {},

		constructors = {},

		//shortcut for throwng an error
		error = function(message) {
			throw new Error(message);
		},

		//method for actually starting a module	
		startModule = function(name) {
			var m = constructors[name],
				elem = document.getElementById(name);

			m = m.call(elem, new arch.Sandbox(elem));
			if (typeof m !== 'object' || typeof m.init !== 'function' || typeof m.destroy !== 'function') {
				error('Module constructor should return an object with init and destroy methods.');
			}
			m.init();
			modules[name] = m;
		};

	module.register = function( /*string*/ name, /*function*/ constructor) {
		typeof name !== 'string' && error('Module name must be a string.');
		typeof constructor !== 'function' && error('Module constructor must be a function.');
		constructors[name] = constructor;
	};
	module.start = function( /*string*/ name) {
		var i, m, elem;
		for (i in arguments) {
			if (arguments.hasOwnProperty(i)) {
				typeof arguments[i] !== 'string' && error('Module names must be strings.');
				typeof constructors[arguments[i]] !== 'function' && error('Module not found.');
				startModule(arguments[i]);
			}
		}
	};
	module.stop = function( /*string*/ name) {
		var i=0,
			args = Array.prototype.slice.call(arguments),
			len = args.length;
		for(i;i<len;i+=1){
			typeof args[i] !== 'string' && error('Module names must be strings.');
			typeof modules[args[i]] === 'object' && modules[args[i]].destroy();
		}
	};
	module.startAll = function() {
		var i;
		for(i in modules){ if(modules.hasOwnProperty(i)){
			startModule(i);	
		}}
	};
	module.stopAll = function() {};

	arch.module = module;
}(window.arch));