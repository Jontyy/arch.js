(function(arch){
	arch.Sandbox = function(elem){
		this.elem = elem;
		typeof this.init === 'function' && this.init(elem);	
	};
}(window.arch));