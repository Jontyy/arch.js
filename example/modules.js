//the core should be concerned with the implementation
arch.core.find = function(query,parent){
	parent = parent || document;
	return parent.querySelectorAll(query);
};
arch.core.on = function(el,evt,func){
	el.addEventListener(evt,func,false);
};
arch.core.append = function(el,html){
	el.innerHTML += html;
};

//sandbox stuff
//init is called on instantiation if present
arch.Sandbox.prototype.init = function(q) {
	this.elem = this.core.find(q)[0];
};
//scope find to this elem
arch.Sandbox.prototype.find = function(query){
	return arch.core.find(query,this.elem);
};
arch.Sandbox.prototype.append = function(html){
	this.core.append(this.elem,html);
};

arch.Sandbox.prototype.on = function(el,evt,func){
	arguments = [].slice.apply(arguments);
	//if we only pass event and func apply it to this.elem
	arguments.length === 2 && [].unshift.call(arguments,this.elem);
	arch.core.on.apply(arch.core,arguments);
};

arch.module.register('messages',function(sb){
	sb.init('ul');

	return {
		events : {
			'newMessage' : 'newMessage'
		},
		newMessage : function(message){
			//you would probably want to use some sort
			//of templating for something which isnt trivial
			sb.append('<li>'+message+'</li>');
		},
		init : function(){},
		destroy:function(){}
	};
});
arch.module.register('input',function(sb){
	sb.init('form');
	return {
		input : sb.find('input[type=text]')[0],
		init : function(){
			var that = this;
			sb.on('submit',function(e){
				e.preventDefault();
				sb.publish('newMessage',that.input.value);
				that.input.value = '';
			});
		},
		destroy : function(){}
	};
});
arch.module.startAll('messages');