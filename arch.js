(function(window){
	"use strict";

	window.arch = {};
}(window));
(function(arch){
	"use strict";
	arch.core = {};
}(window.arch));
(function(arch){
	"use strict";

	var channels = {},

		validation = {},

		//shortcut for throwng an error
		error = function(message){
			throw new Error(message);
		},
		subscribe = function(channel,func,context){
			channels[channel] = channels[channel] || [];
			channels[channel].push({
				callback : func,
				context : context
			});
		},
		publish = function(channel,args){
			var i;
			if(typeof validation[channel] === 'function'){
				if (validation[channel](args) === false){
					return false;
				}
			}
			if(channels[channel]){
				for(i in channels[channel]){ if(channels[channel].hasOwnProperty(i)){
					channels[channel][i].callback.apply(channels[channel][i].context,args);
				}}
			}
		},
		unsubscribe = function(channel,cb){
			var i;
			if(!channels[channel] instanceof Array){
				return false;
			}
			if(typeof cb !== 'function'){
				//not a function just clear the channel
				delete channels[channel];
				return false;
			}
			for(i in channels[channel]){if(channels[channel].hasOwnProperty(i)){
				if(channels[channel][i].callback === cb){
					delete channels[channel][i];
					return true;
				}
			}}
		};


	arch.mediator = {
		publish : function(/*string*/ event){
			var i,args = Array.prototype.slice.call(arguments,1);
			typeof event !== 'string' && error('Event name must be a string.');
			event = event.split(' ');
			for(i in event){if(event.hasOwnProperty(i)){
				if(event[i].length > 0){
					publish(event[i],args);
				}
			}}
		},
		subscribe : function(/*string*/ event, /*function*/ callback){
			var i, ret = [];
			typeof event !== 'string' && error('Event name must be a string.');
			typeof callback !== 'function' && error('Callback must be a function.');
			event = event.split(' ');
			for(i in event){if(event.hasOwnProperty(i)){
				if(event[i].length>0){
					ret.push(subscribe(event[i],callback));
				}
			}}
			return ret.length > 1 ? ret : ret[0];
		},
		unsubscribe : function(/*string*/ channel, /*function*/ callback){
			var i;
			typeof channel !== 'string' && error('Event must be a string.');
			typeof callback !== 'undefined' && typeof callback !== 'function' && error('Callback must be a function.');

			channel = channel.split(' ');
			for(i in channel){if(channel.hasOwnProperty(i)){
				unsubscribe(channel[i],callback);
			}}
		},

		validate : function(/*string*/event,/*function*/callback){
			var i;
			typeof event !== 'string' && error('Event name must be a string.');
			typeof callback !== 'function' && error('Callback must be a function.');
			event = event.split(' ');
			for(i in event){if(event.hasOwnProperty(i)){
				if(event[i].length>0){
					validation[event[i]] = callback;
				}
			}}
			
		}
	};

}(window.arch));
(function(arch){
	"use strict";

	arch.Sandbox = function(elem){
		this.elem = elem;
		typeof this.init === 'function' && this.init(elem);
	};
	arch.Sandbox.prototype = arch.mediator;
	
}(window.arch));
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
	module.stopAll = function() {
		var i;
		for(i in modules){ if(modules.hasOwnProperty(i)){
			modules[i].destroy();
		}}
	};

	arch.module = module;
}(window.arch));