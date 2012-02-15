(function(arch){
	"use strict";

	arch.Sandbox = function(elem){
		this.elem = elem;
		typeof this.init === 'function' && this.init(elem);	
	};
	arch.Sandbox.prototype = arch.mediator;
	
}(window.arch));