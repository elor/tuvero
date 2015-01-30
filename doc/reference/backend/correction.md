# scripts/backend/correction.js


A correction ties a wrong game result to a new game result. This structure is
intended for secure storage only, hence the copying efforts. Since
corrections should be sparse, the copying shouldn't matter.

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./result.html">./result</a>

## Functions

###   Correction = function (pre, post)
constructor

**Argument:** **pre**

previous result (Result instance)
**Argument:** **post**

corrected result (Result instance)

**Returns:** {Correction} new instance

---


###   Correction.prototype.copy = function ()
copy function that creates a new correction from this


**Returns:** {Correction} copy

---


###   Correction.copy = function (corr)
copies a correction object

**Argument:** **corr**

correction object, which doesn't have to have the same prototype
and functions. Fields are sufficient

**Returns:** a copy of the correction instance

---

## Metrics

* 49 Lines
* 1277 Bytes

