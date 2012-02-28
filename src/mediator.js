(function(arch){
	"use strict";

	var id = 0,

		channels = {},

		validation = {},

		//shortcut for throwng an error
		error = function(message){
			throw new Error(message);
		},
		subscribe = function(channel,func){
			id +=1;
			channels[channel] = channels[channel] || {};
			channels[channel][id] = func;
			return id;
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
					channels[channel][i].apply(arch.mediator,args);
				}}
			}
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
		unsubscribe : function(/*int*/ id){
			var i;
			id = parseInt(id,10);
			isNaN(id) && error('ID must be an integer.');

			for(i in channels){if(channels.hasOwnProperty(i)){
				if(channels[i][id]){
					delete channels[i][id];
					return true;
				}	
			}}
			return false;
		},

		validate : function(/*string*/event,/*function*/callback){
			typeof event !== 'string' && error('Event name must be a string.');
			typeof callback !== 'function' && error('Callback must be a function.');
			validation[event] = callback;
		}
	};

}(window.arch));