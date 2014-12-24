# scripts/backend/nettoranking.js


No Description

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###   var Netto = function (size)
NettoRanking: A ranking variant which sorts players by wins and netto
points, in this order.

---


###   Netto.prototype.size = function ()
simply return the stored size


**Returns:** the size

---


###   Netto.prototype.resize = function (size)
resize the internal arrays

**Argument:** **size**

new size

**Returns:** {Netto} this

---


###   Netto.prototype.get = function ()
return an object with ranking-specific data.


**Returns:** {Object} the return object

---


###   Netto.prototype.add = function (result)
Add the result of a game to the ranking table.

**Argument:** **result**

the result

**Returns:** {Netto} this

---


###   Netto.prototype.remove = function (result)
remove the result of a game from the ranking table

**Argument:** **result**

the result

**Returns:** {Netto} this

---


###   Netto.prototype.correct = function (correction)
Correct the result of a game.

**Argument:** **correction**

the correction

**Returns:** {Netto} this

---


###   Netto.prototype.grantBye = function (team)

---

###   Netto.prototype.revokeBye = function (team)

---

###   Netto.prototype.getCorrections = function ()
get a copy of the applied corrections


**Returns:** copy of the array of corrections

---


###   Netto.prototype.added = function (game)
whether the game took place

**Argument:** **game**

the game in question

**Returns:** {Boolean} true if the game is likely to have been added, false
otherwise

---


###   Netto.prototype.toBlob = function ()
stores the current state in a blob


**Returns:** the blob

---


###   Netto.prototype.fromBlob = function (blob)

---

###     function copyCorrection (corr)

---

## Metrics

* 304 Lines
* 5913 Bytes

