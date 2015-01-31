# scripts/backend/ranking.js


Ranking is an interface for different ranking methods. The most important
assumption is about the player ids: They're required to be close-packed
integer values starting at 0.

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./blobber.html">./blobber</a>

## Functions

###       size: function()
Retrieve the size of the internal data structures. This is required to
correspond to the number of players, the largest player id + 1 and the
size of returned arrays. Not that there's no setSize method.


**Returns:** the size of the ranking

---


###       resize: function(size)
Set a certain size. If it shrinks from the current size, older values
are expected to be discarded.

**Argument:** **size**

the new size

**Returns:** this

---


###       get: function()
get() calculates the rankings and returns a sorted list of player ids.
Specific methods to get the values by which the ranking was produced
may still be implemented. CAUTION: The returned object may (and most
likely will) contain references to internal data structures, so be
careful when editing them. Consider them readonly and all's fine


**Returns:** an object containing the ranking as well as and
implementation-specific data which was used for ranking.

---


###       add: function(result)
add() adds a new game result to the internal storage methods.

**Argument:** **{Result}**

result to add

**Returns:** {Ranking} this

---


###       remove: function(result)
remove() removes a game result from the storage. Optional method, but
useful in case of misentry.

**Argument:** **{Result}**

result to erase

**Returns:** {Ranking} this

---


###       correct: function(correction)
correct() changes the result of a previously added game to a new state.
This function should act like erasing the old result and adding the new
one, but might encourage optimized algorithms. Checks whether the old
result was submitted before are encouraged for additional safety.

**Argument:** **{Correction}**

correction

**Returns:** {Ranking} undefined on failure, this on success

---


###       getCorrections: function()
getCorrections() returns a copy of all corrections applied to this.


**Returns:** deep copy of an array of previous corrections

---


###       added: function(game)
verify as good as possible with the stored data whether a particular
game took place and was added to the ranking.

**Argument:** **game**

the game to verify

**Returns:** true of the game is likely to have been added, false otherwise

---


###       grantBye: function(playerid)
grant a bye to a player

**Argument:** **{Integer}**

playerid the player's index

---


###       revokeBye: function(playerid)
revoke a bye

**Argument:** **{Integer}**

playerid the player's index

---

## Metrics

* 130 Lines
* 3703 Bytes

