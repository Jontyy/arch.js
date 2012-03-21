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
		subscribe : function(/*string*/ event, /*function*/ callback, context){
			var i;
			typeof event !== 'string' && error('Event name must be a string.');
			typeof callback !== 'function' && error('Callback must be a function.');
			event = event.split(' ');
			for(i in event){if(event.hasOwnProperty(i)){
				if(event[i].length>0){
					subscribe(event[i],callback,context);
				}
			}}
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