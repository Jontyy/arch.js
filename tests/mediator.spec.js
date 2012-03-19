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

			it('Should allow subscribing to multiple channels with a single callback',function(){
				var callback = jasmine.createSpy(), ids;
				ids = arch.mediator.subscribe('channel1 channel2',callback);

				//handle the ids stuff
				expect(ids instanceof Array).toBe(true);
				expect(ids.length).toBe(2);
				expect(ids[1]).toBeGreaterThan(ids[0]);

				//handle the callbacks stuff
				arch.mediator.publish('channel1','value1');
				arch.mediator.publish('channel2','value2');
				expect(callback).toHaveBeenCalledWith('value1');
				expect(callback).toHaveBeenCalledWith('value2');
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

			it('Should publish with flexible arguments',function(){
				arch.mediator.publish('myevent','test',12345);
				expect(spy).toHaveBeenCalledWith('test',12345);
			});
			it('Should only call the correct callbacks',function(){
				arch.mediator.publish('monkey','monkey');
				expect(spy).wasNotCalledWith('monkey');	
			});

			it('Should allow pubishng on multiple channels',function(){
				var spy = jasmine.createSpy(), args;

				arch.mediator.subscribe('event1 event2',spy);
				arch.mediator.publish('event1 event2','testmultiple');

				args = spy.argsForCall;
				expect(args instanceof Array).toBe(true);
				expect(args.length).toBe(2);
				expect(args[0]).toEqual(args[1]);
			});

		});

		describe('unsubscribe',function(){
			it('Should only accept an integer for event id',function(){
				expect(function(){
					arch.mediator.unsubscribe('myevent');
				}).toThrow(new Error('ID must be an integer.'));

			});

			it('Should allow unsubscribe',function(){
				arch.mediator.unsubscribe(id);
				arch.mediator.publish('myevent','unsubscribed');
				expect(spy).wasNotCalledWith('unsubscribed');
			});
		});
	});

	describe('validation',function(){

		it('Should only accept string+function parameters',function(){
			expect(function(){
				arch.mediator.validate(123,324);
			}).toThrow('Event name must be a string.');	
			expect(function(){
				arch.mediator.validate('test',1234);
			}).toThrow('Callback must be a function.');
		});

		it('Should call the validation method',function(){
			var spy = jasmine.createSpy();
			arch.mediator.validate('validate1',spy);
			arch.mediator.publish('validate1',123,456);
			expect(spy).toHaveBeenCalledWith([123,456]);
		});

		it('Should not publish if validation fails',function(){
			var validateSpy = jasmine.createSpy().andReturn(false),
				subscribeSpy = jasmine.createSpy();
			arch.mediator.validate('validate2',validateSpy);
			arch.mediator.subscribe('validate2',subscribeSpy);

			arch.mediator.publish('validate2','testings');
			expect(subscribeSpy).wasNotCalled();
		});

		it('Should publish if validation passes',function(){
			var validateSpy = jasmine.createSpy().andReturn(true),
				subscribeSpy = jasmine.createSpy();
			arch.mediator.validate('validate3',validateSpy);
			arch.mediator.subscribe('validate3',subscribeSpy);

			arch.mediator.publish('validate3','testings');
			expect(subscribeSpy).toHaveBeenCalledWith('testings');
		});

		it('Should allow validation of multiple channels',function(){
			var validateSpy = jasmine.createSpy(),args;

			arch.mediator.validate('validate4 validate5',validateSpy);
			arch.mediator.publish('validate4 validate5','testmultiple');
			args = validateSpy.argsForCall;
			expect(args instanceof Array).toBe(true);
			expect(args.length).toBe(2);
			expect(args[0]).toEqual(args[1]);
			expect(args[0][0][0]).toBe('testmultiple');
		});
	});

});