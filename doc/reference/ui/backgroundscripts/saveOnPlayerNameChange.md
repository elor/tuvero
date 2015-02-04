# scripts/ui/backgroundscripts/saveOnPlayerNameChange.js


store the state whenever a player name changes

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="../listcollectormodel.html">../listcollectormodel</a>
* <a href="../state_new.html">../state_new</a>
* <a href="../storage.html">../storage</a>
* <a href="../teammodel.html">../teammodel</a>

## Functions

###     function(State, ListCollectorModel, TeamModel, Storage)

---

###       teamCollector.onupdate = function()
overwrite the update listener: save whenever a team has been updated.

Note to self: this also catches setID-fired events. Storage.store
should buffer multiple store() requests anyhow

---

## Metrics

* 23 Lines
* 752 Bytes

