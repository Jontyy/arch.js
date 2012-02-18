/*global jasmine,describe,it,expect,arch,spyOn,beforeEach*/
describe('arch.module', function() {
	"use strict";

	////////////////////////////////////////////
	/// Base tests stuff
	////////////////////////////////////////////

	function createSpyModule() {
		var ret = {
			init: jasmine.createSpy('init'),
			destroy: jasmine.createSpy('destroy')
		};
		ret.constructor = jasmine.createSpy('constructor').andReturn({
			init: ret.init,
			destroy: ret.destroy
		});
		return ret;
	}

	function resetSpyModule(spy) {
		spy.init.reset();
		spy.destroy.reset();
		spy.constructor.reset();
	}

	function testSpy(spy) {
		var args;
		expect(spy.constructor).toHaveBeenCalled();
		args = spy.constructor.argsForCall;
		//ensure it was called with a sandbox object
		expect(args[0][0] instanceof arch.Sandbox).toBeTruthy();
		expect(spy.init).toHaveBeenCalled();
	}

	var spyModules = {
		'map': createSpyModule(),
		'chat': createSpyModule()
	};

	//before each test reset the spies
	beforeEach(function() {
		resetSpyModule(spyModules.map);
		resetSpyModule(spyModules.chat);
	});

	////////////////////////////////////////////
	/// End Of Base tests stuff
	////////////////////////////////////////////

	it('Should be an object', function() {
		expect(typeof arch.module).toBe('object');
	});

	it('Should have register,start,stop,startAll,stopAll methods', function() {
		expect(typeof arch.module.register).toBe('function');
		expect(typeof arch.module.start).toBe('function');
		expect(typeof arch.module.stop).toBe('function');
		expect(typeof arch.module.startAll).toBe('function');
		expect(typeof arch.module.stopAll).toBe('function');
	});


	describe('register', function() {

		it('Should only accept string and function params', function() {
			expect(function() {
				arch.module.register(1, function() {});
			}).toThrow(new Error('Module name must be a string.'));

			expect(function() {
				arch.module.register('mymodule', 1);
			}).toThrow(new Error('Module constructor must be a function.'));
		});
	});

	describe('start/startAll', function() {

		it('Should only accept string parameters', function() {
			expect(function() {
				arch.module.start(12);
			}).toThrow(new Error('Module names must be strings.'));
		});

		it('Should throw error if module not found', function() {
			expect(function() {
				arch.module.start('fakemodule');
			}).toThrow(new Error('Module not found.'));
		});

		it('Should construct a module and run init', function() {
			arch.module.register('chat', spyModules.chat.constructor);
			arch.module.start('chat');
			testSpy(spyModules.chat);
		});

		it('It should try to get a dom element with the same name', function() {
			spyOn(document, 'getElementById');
			arch.module.register('map', spyModules.map.constructor);
			arch.module.start('map');
			expect(document.getElementById).toHaveBeenCalledWith('map');
		});

		describe('startAll',function(){
			//we have only registered 2 modules, map and start
			it('Should call start on all registered modules',function(){
				arch.module.startAll();
				expect(spyModules.map.init).toHaveBeenCalled();
				expect(spyModules.chat.init).toHaveBeenCalled();
			});
		});
	});

	describe('stop/stopAll', function() {

		it('Should only accept string parameters', function() {
			expect(function() {
				arch.module.stop(1244, 'test');
			}).toThrow(new Error('Module names must be strings.'));
		});


		it('Should call the destroy method', function() {
			arch.module.register('map', spyModules.map.constructor);
			arch.module.start('map');
			arch.module.stop('map');
			expect(spyModules.map.destroy).toHaveBeenCalled();
		});
	});
});