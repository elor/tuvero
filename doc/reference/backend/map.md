# scripts/backend/map.js


No Description

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###   var Map = function ()
Map maps integers to close-packed integers in ascending order. It's
intended to serve as a mapping between global and local player ids, but may
work for other purposes as well. Actually, it works as a stack with random
read access, but let's just call it a map


**Returns:** {Map} new Map

---


###   Map.prototype.insert = function (external)
Inserts an element into the map if not already present. Returns the
internal id in both cases

**Argument:** **external**

{Integer} external id

**Returns:** {Integer} internal id

---


###   Map.prototype.erase = function (internal)
Erases an element from the map and decrements all following internal
indices. Note that this function invalidates externally stored internal
ids.

**Argument:** **internal**

{Integer} internal id of the element to erase

---


###   Map.prototype.remove = function (external)
Removes an element from the map and decrements all following internal
indices. It works similar to erase(), with the main difference of passing
the external instead of the internal id

**Argument:** **external**

{Integer} external id

---


###   Map.prototype.clear = function ()
Resets the map to an empty state


**Returns:** {Map} this

---


###   Map.prototype.at = function (internal)
Looks up the external id of the given internal id

**Argument:** **internal**

{Integer} internal id

**Returns:** {Integer} external id or undefined

---


###   Map.prototype.find = function (external)
Finds the internal id of the given external id

**Argument:** **external**

{Integer} external id

**Returns:** {Integer} internal id or -1 if not found

---


###   Map.prototype.size = function ()
Returns the number of elements in the map. This equals the internal index
of the last element plus one.


**Returns:** {Integer} size

---


###   Map.prototype.toBlob = function ()
store the state in a blob object


**Returns:** the blob

---


###   Map.prototype.fromBlob = function (blob)
restore a state from the blob

**Argument:** **blob**

the blob

---

## Metrics

* 136 Lines
* 3027 Bytes

