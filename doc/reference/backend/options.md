# scripts/backend/options.js


define, store, read and write options of arbitrary type

Undefined behavior (most likely infinite loops) on nesting loops
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###       getOptions : function ()
get an object which contains a copy of all options


**Returns:** an object containing copies of the current options

---


###       setOptions : function (options)
set options

**Argument:** **options**

a modified options object retrieved from getOptions()

**Returns:** true on success, false or undefined otherwise

---


###   Options = function ()
constructor


**Returns:** {Options}

---


###   Options.prototype.toBlob = function ()
stores the current state in a blob, mostly using JSON (


**Returns:** the blob

---


###   Options.prototype.fromBlob = function (blob)
restores a state from the blob

**Argument:** **blob**

the blob

---


###   function toType (obj)

---

###   function copyStaticObject (obj)

---

###   Options.prototype.getOptions = function ()

---

###   Options.getOptions = function (obj)

---

###   Options.prototype.setOptions = function (options)

---

###   Options.setOptions = function (obj, opts)

---

## Metrics

* 134 Lines
* 2808 Bytes

