# scripts/backend/rleblobber.js


No Description

* Exports: RLEBlobber
* Implements: Blobber
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###   var RLEBlobber = function (array)
RLEBlobber: A blobber for multi-dimensional sparse non-circular arrays,
intended for numerical data. Compression occurs using run-length-encoding
of all entries that represent null in some form, e.g. undefined, null and 0

Contents of the array can only be numbers at this point

This object can work with encapsulated instances or static functions. Use
what suits you best, they're calling each other anyway.

**Argument:** **array**

a reference to the array

**Returns:** {RLEBlobber} this

---


###   RLEBlobber.prototype.getArray = function ()
getter for the contained array


**Returns:** the contained array

---


###   RLEBlobber.prototype.toBlob = function ()
creates and returns a string representation of the contained array


**Returns:** a string representation of the contained array

---


###   RLEBlobber.prototype.fromBlob = function (blob)
creates a new array object and stores it in this.array

**Argument:** **blob**

the string representation


**Returns:** nothing

---


###   RLEBlobber.toBlob = function (array)
create a blob from the given array using run length encoding

Important Note: This function does not detect circular references! In those
cases, it will recurse forever!

**Argument:** **array**

a sparse multidimensional non-circular array

**Returns:** a string representation of array

---


###   RLEBlobber.fromBlob = function (blob)
parse the blob and return its contents as an array

**Argument:** **blob**

the string representation

**Returns:** an array which has been decoded from the blob, or undefined on
failure

---


###   function toType (obj)
replacement of the typeof function

Source:
http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/

---


###   function isArray (obj)

---

###   function isNumber (obj)

---

## Metrics

* 294 Lines
* 7510 Bytes

