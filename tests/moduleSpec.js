/*global jasmine,describe,it,expect,arch*/
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


});