(function(arch){
	"use strict";

	var id = 0,

		channels = {},

		//shortcut for throwng an error
		error = function(message){
			throw new Error(message);
		};


	arch.mediator = {
		publish : function(event){
			var i,args = Array.prototype.slice.call(arguments,1);
			console.log(args);
			if(channels[event]){
				for(i in channels[event]){ if(channels[event].hasOwnProperty(i)){
					channels[event][i].apply(arch.mediator,args);
				}}
			}
		},
		subscribe : function(event,callback){
			typeof event !== 'string' && error('First param should be an event name');
			typeof callback !== 'function' && error('Second param should be a callback function.');

			channels[event] = channels[event] || {};
			channels[event][id] = callback;
			id +=1;
			return id;
		},
		unsubscribe : function(){
			
		}
	};

}(window.arch));