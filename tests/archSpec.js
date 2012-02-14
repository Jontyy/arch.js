/*global describe,it,expect,arch*/
describe('arch',function(){
   "use strict";

   it('Should be an object',function(){
      expect(typeof arch).toBe('object');   
   });

   it('Should have a module object',function(){
      expect(typeof arch.module).toBe('object');
   });

   it('Should have a core object',function(){
      expect(typeof arch.core).toBe('object');
   });

   it('Should have a sandbox property',function(){
      expect(typeof arch.sandbox).toNotBe('undefined');
   });



   



   
});