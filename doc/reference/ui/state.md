# scripts/ui/state.js


interface for creating a singular blob for data necessary to continue the
state in a different user session.
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./history.html">./history</a>
* <a href="./options.html">./options</a>
* <a href="./shared.html">./shared</a>
* <a href="./tab_games.html">./tab_games</a>
* <a href="./tab_history.html">./tab_history</a>
* <a href="./tab_new.html">./tab_new</a>
* <a href="./tab_ranking.html">./tab_ranking</a>
* <a href="./tabshandle.html">./tabshandle</a>
* <a href="./tab_teams.html">./tab_teams</a>
* <a href="./team.html">./team</a>
* <a href="./tournaments.html">./tournaments</a>

## Functions

###     toBlob : function ()
store the current program state in a blob


**Returns:** the blob

---


###     fromBlob : function (blob)
restore the program state from the blob

**Argument:** **blob**

the blob

---


###     reset : function ()
resets everything managed by Blob

---

## Metrics

* 76 Lines
* 1866 Bytes

