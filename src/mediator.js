(function(arch){
	"use strict";

	var id = 0,

		channels = {},

		//shortcut for throwng an error
		error = function(message){
			throw new Error(message);
		};


	arch.mediator = {
		publish : function(/*string*/ event){
			var i,args = Array.prototype.slice.call(arguments,1);
			typeof event !== 'string' && error('Event name must be a string.');
			if(channels[event]){
				for(i in channels[event]){ if(channels[event].hasOwnProperty(i)){
					channels[event][i].apply(arch.mediator,args);
				}}
			}
		},
		subscribe : function(/*string*/ event, /*function*/ callback){
			typeof event !== 'string' && error('Event name must be a string.');
			typeof callback !== 'function' && error('Callback must be a function.');

			id +=1;
			channels[event] = channels[event] || {};
			channels[event][id] = callback;
			
			return id;
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
		}
	};

}(window.arch));