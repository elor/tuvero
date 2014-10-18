# scripts/backend/vector.js


Vector variable to contain all vector operations and definitions where a
vector is represented as a javascript array
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###     copy : function (vector)
Copies the the vector into a new sparse array

**Argument:** **vector**

{Array} source

**Returns:** {Array} copy

---


###     dot : function (a, b, size)
dot product of two vectors

**Argument:** **a**

{Array} first operand
**Argument:** **b**

{Array} second operand
**Argument:** **size**

{Integer} supposed size of the vectors (optional, defaults to
max(a.length, b.length))

**Returns:** {Number}

---


###     fill : function (vector)
Fills undefined elements of the vector with 0

**Argument:** **vector**

{Array} input and output vector

**Returns:** {Array} reference to the vector

---


###     scale : function (vector, factor)
scales the vector by the factor

**Argument:** **vector**

{Array} vector
**Argument:** **factor**

{Number} factor

**Returns:** {Array} reference to vector

---


###     sum : function (vector)
Sum calculates the sum of all elements of the vector

**Argument:** **vector**

{Array} input vector

**Returns:** {Number} the vector sum

---

## Metrics

* 121 Lines
* 2478 Bytes

