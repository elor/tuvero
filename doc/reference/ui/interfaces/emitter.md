# scripts/ui/interfaces/emitter.js


An event emitter class

@returns Emitter
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###   function Emitter ()
Constructor

---


###   Emitter.prototype.emit = function (event, data)
Emits an event to all registered listeners by calling the callback
functions of format 'on'+event, if available

The callback functions' parameters are the emitter (this) and the event
string (without 'on'), in this order.

**Argument:** **event**

a string containing the name of the event. Callback functions need
to have a function name in the format 'on'+event
**Argument:** **data**

arbitrary additional data. Please keep it simple!

**Returns:** s true if the some listener received the event, false otherwise

---


###   Emitter.prototype.registerListener = function (listener)
register an event listener

**Argument:** **listener**

an event listener instance, which should define the necessary
callback functions

**Returns:** s this

---


###   Emitter.prototype.unregisterListener = function (listener)
Makes sure that the event listener is not receiving event callbacks anymore

**Argument:** **listener**

an instance of the View class, which may have already been
registered

**Returns:** s this

---

## Metrics

* 84 Lines
* 2106 Bytes

