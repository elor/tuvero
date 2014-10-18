# scripts/backend/fullmatrix.js


No Description

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###   var FullMatrix = function (size)
FullMatrix: Square matrix implementation according to Matrix.Interface
Empty entries are specified as undefined array values

**Argument:** **size**

{Integer} size of the matrix. defaults to 0

**Returns:** {FullMatrix} this

---


###   FullMatrix.prototype.clear = function (size)
Restores a blank state of the FullMatrix


**Returns:** {FullMatrix} this

---


###   FullMatrix.prototype.clone = function ()
copies the matrix. Optimizations in term of memory are attempted


**Returns:** {FullMatrix} the copy

---


###   FullMatrix.prototype.erase = function (index)
erases the rows and cols associated with the index from the matrix

**Argument:** **index**

{Integer} index

**Returns:** {FullMatrix} this

---


###   FullMatrix.prototype.extend = function (by)
simply increases this.size. array expansions occur in the set function

**Argument:** **by**

integer amount by which to extend the array. defaults to 1

**Returns:** {FullMatrix} this

---


###   FullMatrix.prototype.get = function (row, col)
retrieves the value from the given indices.

**Argument:** **row**

vertical position
**Argument:** **col**

horizontal position

**Returns:** value at (row, col). defaults to 0

---


###   FullMatrix.prototype.set = function (row, col, value)
sets the value at the given indices and allocates/frees the field if
necessary

**Argument:** **row**

vertical position
**Argument:** **col**

horizontal position
**Argument:** **value**

integer value to store in position (row, col)

**Returns:** {FullMatrix} this

---

## Metrics

* 169 Lines
* 3484 Bytes

