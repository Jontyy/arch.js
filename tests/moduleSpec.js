/*global jasmine,describe,it,expect,arch,spyOn,beforeEach*/
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
	});

	describe('start/startAll',function(){
		//create 2 spy modules
		var spy1, spy2;

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
		}

		function testSpy(spy){
			var args;
			expect(spy.constructor).toHaveBeenCalled();
			args = spy.constructor.argsForCall;
			//ensure it was called with a sandbox object
			expect(args[0][0] instanceof arch.Sandbox).toBeTruthy();
			expect(spy.init).toHaveBeenCalled();
		}

		beforeEach(function(){
			spy1 = createSpyModule();
			spy2 = createSpyModule();	
		});


		it('Should construct a module and run init',function(){
			arch.module.register('map',spy1.constructor);
			arch.module.start('map');
			testSpy(spy1);
		});

		it('It should try to get a dom element with the same name',function(){
			spyOn(document,'getElementById');
			arch.module.register('lookForThisNode',spy1.constructor);
			arch.module.start('lookForThisNode');
			expect(document.getElementById).toHaveBeenCalledWith('lookForThisNode');
		});

	});
});