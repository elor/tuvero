# scripts/ui/tab_settings.js


Model, View and Controller of the settings tab

This tab allows viewing and changing various settings of the program.

* Exports: Tab_Settings
* Implements: ./tab
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./history.html">./history</a>
* lib/Blob
* lib/FileSaver
* <a href="./options.html">./options</a>
* <a href="./players.html">./players</a>
* <a href="./ranking.html">./ranking</a>
* <a href="./shared.html">./shared</a>
* <a href="./state.html">./state</a>
* <a href="./storage.html">./storage</a>
* <a href="./strings.html">./strings</a>
* <a href="./tab.html">./tab</a>
* <a href="./tabshandle.html">./tabshandle</a>
* <a href="./team.html">./team</a>
* <a href="./toast.html">./toast</a>
* JQuery


## Functions

###   function initCSV()

---

###   function csvupdate($button)

---

###   function initLoad()

---

###   function invalidateLoad()

---

###   function loadFileError(evt)

---

###   function loadFileLoad(evt)

---

###   function loadFileAbort()

---

###   function reloadAutocomplete()

---

###   function initAutocomplete()

---

###   function invalidateAutocomplete()

---

###   function autocompleteFileError(evt)

---

###   function autocompleteFileLoad(evt)

---

###   function autocompleteFileAbort()

---

###   function updateLocalStorageMeters()

---

###   function initLocalStorage()

---

###   function resetStorageState()
toggles the storage state depending on the current autosave checkbox state.


**Returns:** {Boolean} true if autosave is enabled, false otherwise

---


###   function init()

---

###   function reset()
reset an initial state

---


###   function update()

---

## Metrics

* 358 Lines
* 8482 Bytes

