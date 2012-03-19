(function(arch){
	"use strict";

	arch.Sandbox = function(elem,core){
		this.elem = elem;
		this.core = core;
		typeof this.init === 'function' && this.init(elem);
	};
	arch.Sandbox.prototype = arch.mediator;
	
}(window.arch));