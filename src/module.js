(function(arch) {
	"use strict";
	var module = {},

		modules = {},

		constructors = {},

		//shortcut for throwng an error
		error = function(message) {
			throw new Error(message);
		},
		bindEvents = function(events,module){
			typeof events !== 'object' && error('Events must be an object.');
			for(var evt in events){if(events.hasOwnProperty(evt)){
				if(typeof evt !== 'string' || typeof events[evt] !== 'string'){
					error('Events must be an object with string keys and values.');
				}
				typeof module[events[evt]] !== 'function' && error("'"+events[evt]+"' is not a method of this module.");
				arch.mediator.subscribe(evt,module[events[evt]],module);
			}}
		},
		//method for actually starting a module
		startModule = function(name) {
			var m = constructors[name],
				elem = document.getElementById(name);

			m = m.call(elem, new arch.Sandbox(elem,arch.core));
			if (typeof m !== 'object' || typeof m.init !== 'function' || typeof m.destroy !== 'function') {
				error('Module constructor should return an object with init and destroy methods.');
			}
			typeof m.events !== 'undefined' && bindEvents(m.events,m);
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
		for(i in constructors){ if(constructors.hasOwnProperty(i)){
			startModule(i);
		}}
	};
	module.stopAll = function() {
		var i;
		for(i in modules){ if(modules.hasOwnProperty(i)){
			modules[i].destroy();
		}}
	};

	arch.module = module;
}(window.arch));