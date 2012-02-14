/*global jasmine,describe,it,expect,arch,spyOn*/
describe('arch.module',function(){
	"use strict";

	it('Should be an object',function(){
		expect(typeof arch.module).toBe('object');
	});

	it('Should have register,start,stop,startAll,stopAll methods',function(){
		expect(typeof arch.module.register).toBe('function');
		expect(typeof arch.module.start).toBe('function');
		expect(typeof arch.module.stop).toBe('function');
		expect(typeof arch.module.startAll).toBe('function');
		expect(typeof arch.module.stopAll).toBe('function');
	});


	describe('register',function(){
		
		it('Should only accept string and function params',function(){
			expect(function(){
				arch.module.register(1,function(){});
			}).toThrow(new Error('Module name must be a string.'));

			expect(function(){
				arch.module.register('mymodule',1);
			}).toThrow(new Error('Module constructor must be a function.'));
		});

		it('Should attempt to link module name with an element',function(){
			spyOn(document,'getElementById');
			try{	
				arch.module.register('map',function(){});
			}catch(err){}
			expect(document.getElementById).toHaveBeenCalledWith('map');
		});

		it('Should throw error if element not found',function(){
			spyOn(document,'getElementById').andReturn(null);
			expect(function(){
				arch.module.register('chat',function(){});
			}).toThrow(new Error('Module name must be an id of an element.'));
		});

		it('Should allow to link with DOM elements',function(){
			spyOn(document,'getElementById').andReturn({
				nodeType : 1
			});
			arch.module.register('chat',function(){});
		});

	});

});