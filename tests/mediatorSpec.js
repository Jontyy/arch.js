/*global jasmine,describe,it,expect,arch*/
describe('arch.mediator',function(){
	"use strict";

	it('Should be an object',function(){
		expect(typeof arch.mediator).toBe('object');
	});

	it('Should have pub/sub methods',function(){
		expect(typeof arch.mediator.publish).toBe('function');
		expect(typeof arch.mediator.subscribe).toBe('function');
		expect(typeof arch.mediator.unsubscribe).toBe('function');
	});


	describe('pubsub',function(){
		var id = null, spy = jasmine.createSpy(function(){});	

		it('Should allow to subscribe to events',function(){
			var i = arch.mediator.subscribe('myevent',spy);
			expect(typeof i).toBe('number');
			id = i;
		});

		it('Should publish',function(){
			arch.mediator.publish('myevent','test');
			expect(spy).toHaveBeenCalledWith('test');
		});
	});

});