# scripts/ui/type.js


A simple type verification library.

In addition to the Type() and Type.is() functions, Type.isNumber(),
Type.isBoolean(), Type.isArray() etc. functions are available, but lack
additional documentation.

* Exports: Type
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###   function capitalize (str)
helper function to capitalize a string

**Argument:** **str**

an arbitrary string of length > 0

**Returns:** s the same string, with the first letter in upper case and the rest
in lower case

---


###   function ()
anonymous reference function

---


###   function Type (obj)
get the type string of an object, while also distinguishing between
objects, arrays, dates etc.

**Argument:** **obj**

the object

**Returns:** s a lower-case single-word type string of the object.

---


###   Type.is = function (obj, typestring)
generic type comparison function. Other generic functions include:

Type.isNumber(obj)

Type.isObject(obj)

Type.isString(obj)

Type.isUndefined(obj)

Type.isNull(obj)

Type.isDate(obj)

Type.isArray(obj)

Type.isRegexp(obj)

Type.isBoolean(obj)

Type.isFunction(obj)

**Argument:** **obj**

the object
**Argument:** **typestring**

the type string, as it may have been returned by Type()

**Returns:** s true if the typestring matches Type(obj), false otherwise

---


###     Type['is' + capitalize(typestring)] = function (obj)
Type.isSomething() closure

---

## Metrics

* 95 Lines
* 2188 Bytes

