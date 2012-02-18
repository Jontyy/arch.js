#arch.js (Still in development)

arch.js is an extremely simple framework for structuring JavaScript applications, inspired by the works of [Nicholas Zakas](http://www.youtube.com/watch?v=vXjVFPosQHw) and [Addy Osmani](http://addyosmani.com/largescalejavascript/), the idea is to split up all functionality into small, decoupled chunks which communicate via a mediator.

## Obligatory Hello World
``` javascript
    arch.module.register('greeting',function(sb){
       //this function is used to wrap the module
       //the return value must be an object with init and destroy methods
       //this function will only be called when the module is started

       return {
           init : function(){
               sb.elem.innerHTML = 'Hello world';
           },
           destroy : function(){}
       };
    });
    arch.module.start('greeting');
    //note: startAll() can be called if necessary
```

## Modules
Modules are the key idea behind arch, the base functionality is provided by the arch.module object, it has the following methods `register`,`start`,`startAll`,`stop`, `stopAll`, you can find detailed information about these below.

### register
``` javascript
    arch.module.register(/*string*/ name,/*function*/ constructor);
```
Above is the prototype for the register function, as you can see it accepts 2 parameters, a name and a constructor function (not like the constructor that you use 'new' with). The name parameter is unique and is used to identify individual modules. The constructor function will receive a Sandbox object as the first parameter (more on this later). The constructor function is expected to return an object with init and destroy methods, these are used for starting the module and cleaning it up if necessary.

The constructor function is expected to return an object with `init` and `destroy` methods, these are for setting up the module and cleaning it up. This constructor function is only called when either `arch.module.start` or `arch.module.startAll` are called.