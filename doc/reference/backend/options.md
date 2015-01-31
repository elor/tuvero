# scripts/backend/options.js


Provide functions to define, store, read and write options objects of
arbitrary type. Can be used by other code to maintain their internal set of
options

Undefined behavior (most likely infinite loops) on nesting loops

* Exports: Options
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###       getOptions: function()
get an object which contains a copy of all options


**Returns:** an object containing copies of the current options

---


###       setOptions: function(options)
set options

**Argument:** **options**

a modified options object retrieved from getOptions()

**Returns:** true on success, false or undefined otherwise

---


###   Options = function()
constructor


**Returns:** {Options}

---


###   Options.prototype.toBlob = function()
stores the current state in a blob, mostly using JSON (


**Returns:** a serialization of the object

---


###   Options.prototype.fromBlob = function(blob)
restores a state from the blob

**Argument:** **blob**

the blob

**Returns:** this

---


###   function toType(obj)

---

###   function copyStaticObject(obj)

---

###   Options.prototype.getOptions = function()

---

###   Options.getOptions = function(obj)

---

###   Options.prototype.setOptions = function(options)

---

###   Options.setOptions = function(obj, opts)

---

## Metrics

* 139 Lines
* 2950 Bytes

