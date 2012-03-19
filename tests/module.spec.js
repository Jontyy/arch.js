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
		ret.constructor = jasmine.createSpy('constructor').andReturn(ret);
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

		describe('startAll', function() {
			//we have only registered 2 modules, map and start
			it('Should call start on all registered modules', function() {
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
			arch.module.stop('map');
			expect(spyModules.map.destroy).toHaveBeenCalled();
		});
		describe('stopAll', function() {
			it('Should call destroy on all modules', function() {
				arch.module.stopAll();
				expect(spyModules.map.destroy).toHaveBeenCalled();
				expect(spyModules.chat.destroy).toHaveBeenCalled();
			});
		});
	});

	describe('events', function() {

		it('Should only allow a hash of string keys and values', function() {
			var m = createSpyModule();
			arch.module.register('events1', m.constructor);

			expect(function() {
				m.events = 123;
				arch.module.start('events1');
			}).toThrow('Events must be an object.');

			expect(function() {
				m.events = {
					'':123
				};
				arch.module.start('events1');
			}).toThrow('Events must be an object with string keys and values.');

			expect(function(){
				m.events = {
					'evt1' : 'Testings'
				};
				arch.module.start('events1');
			}).toThrow("'Testings' is not a method of this module.");
		});

		it('Should call the mediator with the event,method and module as context',function(){
			var m = createSpyModule(),
				sub = spyOn(arch.mediator, 'subscribe');

			arch.module.register('events2',m.constructor);
			m.handleSearch = function(){};
			m.events = {
				'search' : 'handleSearch'
			};
			arch.module.start('events2');
			expect(sub).toHaveBeenCalledWith('search',m.handleSearch,m);
		});
	});
});
