# scripts/backend/matrix.js


Matrix variable contains functions and interfaces for matrix/vector
operations.
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###     clear : function ()
Square Matrix interface with default size 0. behavior for out-of-bounds
indices and wrong types is undefined.

---


###     clone : function ()

---

###     erase : function (index)

---

###     extend : function (by)

---

###     get : function (row, col)

---

###     set : function (row, col, value)

---

###   equalSize : function (A, B)
equalSize performs an equality test of the sizes of both matrices

**Argument:** **A**

{Matrix} first matrix
**Argument:** **B**

{Matrix} second matrix

**Returns:** {Boolean} true if sizes are equal, false otherwise

---


###   getRow : function (matrix, row)
copies the specified row of the matrix to a populated vector

**Argument:** **matrix**

{Matrix} matrix
**Argument:** **row**

{Integer} row number

**Returns:** {Array} populated vector representing the row

---


###   getCol : function (matrix, col)
copies the specified col of the matrix to a populated vector

**Argument:** **matrix**

{Matrix} matrix
**Argument:** **col**

{Integer} col number

**Returns:** {Array} populated vector representing the row

---


###   rowSum : function (matrix, row)
calculates and returns the row sum

**Argument:** **matrix**

{Matrix} matrix
**Argument:** **row**

{Integer} row number

**Returns:** {Number} the row sum

---


###   rowSums : function (matrix)
Calculates all row sums

**Argument:** **matrix**

{Matrix} matrix

**Returns:** {Array} vector of row sums

---


###   mult : function (A, B, C)
Matrix Multiplication. All arguments are required to implement the Matrix
interface.

**Argument:** **A**

first operand
**Argument:** **B**

second operand
**Argument:** **C**

return reference

**Returns:** C

---


###   multVec : function (matrix, vector)
Matrix-Vector multiplication. vector is automatically extended or shrinked
to the size of the matrix.

**Argument:** **matrix**

{Matrix} matrix operand
**Argument:** **vector**

{Array} vector operand

**Returns:** {Array} resulting vector, which is fully populated with integer
values

---


###   colSum : function (matrix, col)
calculates and returns the col sum

**Argument:** **matrix**

{Matrix} matrix
**Argument:** **col**

{Integer} col number

**Returns:** {Number} the col sum

---


###   colSums : function (matrix)
Calculates all col sums

**Argument:** **matrix**

{Matrix} matrix

**Returns:** {Array} vector of col sums

---


###   transpose : function (matrix)
Transpose the matrix in place

**Argument:** **matrix**

{Matrix} matrix to transpose

**Returns:** {Matrix} a reference to matrix

---


###   vecMult : function (vector, matrix)
Vector-Matrix multiplication. vector is automatically extended or shrinked
to the size of the matrix.

**Argument:** **vector**

{Array} vector operand
**Argument:** **matrix**

{Matrix} matrix operand

**Returns:** {Array} resulting vector, which is fully populated with integer
values

---

## Metrics

* 302 Lines
* 6546 Bytes

