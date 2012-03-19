/*global jasmine,describe,it,expect,arch,spyOn,beforeEach*/
describe('sandbox',function(){
	
	it('Should accept an elem constructor parameter',function(){
		var sb = new arch.Sandbox('testing');
		expect(sb.elem).toBe('testing');
	});

	it('Should call an init method if present(with the elem item)',function(){
		var elem = 'dummyElement',
			spy = jasmine.createSpy(function(){}),args;
		
		arch.Sandbox.prototype.init = spy;
		new arch.Sandbox(elem);
		expect(spy).toHaveBeenCalledWith(elem);

	});

	it('Should have all the mediator methods',function(){
		var sb = new arch.Sandbox();
		expect(typeof sb.publish).toBe('function');
		expect(typeof sb.subscribe).toBe('function');
		expect(typeof sb.unsubscribe).toBe('function');
	});
});