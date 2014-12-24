# scripts/backend/finebuchholzranking.js


No Description

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./correction.html">./correction</a>
* <a href="./halfmatrix.html">./halfmatrix</a>
* <a href="./matrix.html">./matrix</a>
* <a href="./result.html">./result</a>
* <a href="./rleblobber.html">./rleblobber</a>
* <a href="./vector.html">./vector</a>

## Functions

###   var Finebuchholz = function (size)
FinebuchholzRanking: A ranking variant which sorts players by wins,
buchholz points, finebuchholz points and netto points, in this order.

---


###   Finebuchholz.prototype.size = function ()
simply return the stored size


**Returns:** the size

---


###   Finebuchholz.prototype.resize = function (size)
resize the internal structures

**Argument:** **size**

new size

**Returns:** {Finebuchholz} this

---


###   Finebuchholz.prototype.get = function ()
return an object containing all points data and a sorted array of pids
representing the ranking


**Returns:** data object

---


###   Finebuchholz.prototype.add = function (result)
Add the result of a game to the ranking table.

**Argument:** **result**

the result

**Returns:** {Finebuchholz} this

---


###   Finebuchholz.prototype.remove = function (result)
remove the result of a game from the ranking table

**Argument:** **result**

the result

**Returns:** {Finebuchholz} this

---


###   Finebuchholz.prototype.correct = function (correction)
Correct the result of a game.

**Argument:** **oldres**

the correction

**Returns:** {Finebuchholz} undefined on failure, this otherwise

---


###   Finebuchholz.prototype.grantBye = function (team)

---

###   Finebuchholz.prototype.revokeBye = function (team)

---

###   Finebuchholz.prototype.added = function (game)
whether a game was played

**Argument:** **game**

an instance of the game that could have taken place

**Returns:** true if all data indicates that this game took place, false
otherwise.

---


###     t1func = function (p1)

---

###   Finebuchholz.prototype.getCorrections = function ()
get a copy of the applied corrections


**Returns:** copy of the array of corrections

---


###   Finebuchholz.prototype.toBlob = function ()
stores the current state in a blob


**Returns:** the blob

---


###   Finebuchholz.prototype.fromBlob = function (blob)

---

###     function copyCorrection (corr)

---

## Metrics

* 363 Lines
* 7931 Bytes

