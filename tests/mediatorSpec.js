/*global jasmine,describe,it,expect,arch*/
describe('arch.mediator',function(){
	"use strict";

	it('Should be an object',function(){
		expect(typeof arch.mediator).toBe('object');
	});

	it('Should have pub/sub/unsubscribe methods',function(){
		expect(typeof arch.mediator.publish).toBe('function');
		expect(typeof arch.mediator.subscribe).toBe('function');
		expect(typeof arch.mediator.unsubscribe).toBe('function');
	});


	describe('pubsub',function(){
		var id = null, spy = jasmine.createSpy(function(){});	

		describe('Subscribe',function(){
			it('Should only accept string+function parameters',function(){
				expect( function(){
					arch.mediator.subscribe({});
				} ).toThrow(new Error('Event name must be a string.'));

				expect(function(){
					arch.mediator.subscribe('eventName',{});
				}).toThrow(new Error('Callback must be a function.'));

			});

			it('Should allow to subscribe to events + return event id',function(){
				var i = arch.mediator.subscribe('myevent',spy);
				expect(typeof i).toBe('number');
				id = i;
			});

			it('Should provide a different id for each subscription',function(){
				var i = arch.mediator.subscribe('eventName',function(){});
				expect(i).toNotEqual(id);
				expect(i).toBeGreaterThan(id);	
			});
		});

		describe('Publish',function(){
			
			it('Should only accept string for event name',function(){
				expect(function(){
					arch.mediator.publish({});
				}).toThrow(new Error('Event name must be a string.'));
			});

			it('Should publish',function(){
				arch.mediator.publish('myevent','test');
				expect(spy).toHaveBeenCalledWith('test');
			});

			it('Should only call the correct callbacks',function(){
				arch.mediator.publish('monkey','monkey');
				expect(spy).wasNotCalledWith('monkey');	
			});

		});

		describe('unsubscribe',function(){
			it('Should allow unsubscribe',function(){
				arch.mediator.unsubscribe(id);
				arch.mediator.publish('myevent','unsubscribed');
				expect(spy).wasNotCalledWith('unsubscribed');
			});
		});
	});

});