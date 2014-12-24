# scripts/ui/storage.js


Storage object, which binds storage keys to actual objects for storage and
retrieval from a local storage

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/modernizr
* <a href="./options.html">./options</a>
* <a href="./shared.html">./shared</a>

## Functions

###   function saveKey (key)

---

###   function loadKey (key)

---

###   Storage.clear = function (key)
remove this and only this key from localStorage to avoid collision with
other software under the same domain

---


###   Storage.store = function ()
store everything

---


###   Storage.restore = function ()
restore everything


**Returns:** true on successful load, false otherwise

---


###   Storage.enable = function ()
enables localStorage, if possible. Necessary initialization

---


###   Storage.disable = function ()
disables the storage. This will inhibit any of the other functions,
including clear(). Note that disable() doesn't clear the storage.

---


###   Storage.changed = function ()
this function indicates a change in the tournament state

---

## Metrics

* 159 Lines
* 3148 Bytes

