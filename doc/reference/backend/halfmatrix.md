# scripts/backend/halfmatrix.js


No Description

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./rleblobber.html">./rleblobber</a>

## Functions

###   var HalfMatrix = function (type, size)
HalfMatrix: Half square matrix implementation according to
Matrix.Interface. Empty entries are referenced as undefined array values.
All values above the main diagonal aren't stored at all. See get/set for
details. The implementation may use more arrays than necessary, but they
are expected to be populated to a reasonable degree

**Argument:** **size**

{Integer} size of the matrix
**Argument:** **type**

{Integer} an integer identifying the type of the half matrix: -1:
negated, 0: empty, 1: mirrored

**Returns:** {HalfMatrix} this

---


###   HalfMatrix.prototype.setType = function (type)
sets a type

**Argument:** **type**

type id (HalfMatrix.empty/mirrored/negated)

**Returns:** this on success, undefined otherwise

---


###   HalfMatrix.prototype.clear = function (size)
Restores a blank state of the HalfMatrix

**Argument:** **size**

the new size of the matrix

**Returns:** {HalfMatrix} this

---


###   HalfMatrix.prototype.clone = function ()
copies the matrix. Optimizations in term of memory are attempted


**Returns:** {HalfMatrix} the copy

---


###   HalfMatrix.prototype.erase = function (index)
erases the rows and cols associated with the index from the matrix

**Argument:** **index**

{Integer} index

**Returns:** {HalfMatrix} this

---


###   HalfMatrix.prototype.extend = function (by)
simply increases this.size. array expansions occur in the set function

**Argument:** **by**

integer amount by which to extend the array. defaults to 1

**Returns:** {HalfMatrix} this

---


###   HalfMatrix.prototype.getEmpty = function (row, col)
retrieves the value from the given indices using the empty type

**Argument:** **row**

vertical position
**Argument:** **col**

horizontal position

**Returns:** value at (row, col). defaults to 0

---


###   HalfMatrix.prototype.getMirrored = function (row, col)
retrieves the value from the given indices using the mirrored type

**Argument:** **row**

vertical position
**Argument:** **col**

horizontal position

**Returns:** value at (row, col). defaults to 0

---


###   HalfMatrix.prototype.getNegated = function (row, col)
retrieves the value from the given indices using the negated type

**Argument:** **row**

vertical position
**Argument:** **col**

horizontal position

**Returns:** value at (row, col). defaults to 0

---


###   HalfMatrix.prototype.setMirrored = function (row, col, value)
set() function for mirrored half matrices

**Argument:** **row**

row
**Argument:** **col**

column
**Argument:** **value**

value

**Returns:** this

---


###   HalfMatrix.prototype.setNegated = function (row, col, value)
set() function for 'negated' half matrices

**Argument:** **row**

row
**Argument:** **col**

column
**Argument:** **value**

value

**Returns:** this

---


###   HalfMatrix.prototype.setEmpty = function (row, col, value)
sets the value at the given indices and allocates/frees the field if
necessary. Values below the main diagonal are ignored.

**Argument:** **row**

vertical position
**Argument:** **col**

horizontal position
**Argument:** **value**

integer value to store in position (row, col)

**Returns:** {HalfMatrix} this

---


###   HalfMatrix.prototype.toBlob = function ()
store content in a convenient blob


**Returns:** s a serialization of the matrix

---


###   HalfMatrix.prototype.fromBlob = function (blob)
reset the matrix from a blob 

**Argument:** **blob**
a serialization of the state

---

## Metrics

* 339 Lines
* 7364 Bytes

