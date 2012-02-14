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

	describe('start/startAll',function(){
		it('Should only accept string parameters',function(){
			expect(function(){
				arch.module.start(12);
			}).toThrow(new Error('Module names must be strings.'));
		});

		it('Should throw error if module not found',function(){
			expect(function(){
				arch.module.start('fakemodule');
			}).toThrow(new Error('Module not found.'));
		});

		function createSpyModule(){
			var ret = {
				init : jasmine.createSpy('init'),
				destroy : jasmine.createSpy('destroy')
			};
			ret.constructor = jasmine.createSpy('constructor').andReturn({
				init : ret.init,
				destroy : ret.destroy
			});
			return ret;
		};

		it('Should construct a module and run init',function(){
			spyOn(document,'getElementById').andReturn({
				nodeType : 1
			});
			var spy = createSpyModule();

			arch.module.register('map',spy.constructor);
			arch.module.start('map');
			expect(spy.constructor).toHaveBeenCalled();
			expect(spy.init).toHaveBeenCalled();
		});

		it('Should construct multiple modules',function(){
			spyOn(document,'getElementById').andReturn({
				nodeType : 1
			});
			var s1 = createSpyModule(), s2 = createSpyModule();
			arch.module.register('sp1',s1.constructor);
			arch.module.register('sp2',s2.constructor);
			arch.module.start('sp1','sp2');
			expect(s1.constructor).toHaveBeenCalled();
			expect(s1.init).toHaveBeenCalled();

			expect(s2.constructor).toHaveBeenCalled();
			expect(s2.init).toHaveBeenCalled();
		});

	});
});