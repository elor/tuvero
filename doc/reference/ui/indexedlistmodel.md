# scripts/ui/indexedlistmodel.js


A ListModel, which also adjusts the ids using setID

* Exports: IndexedListModel
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./listmodel.html">./listmodel</a>

## Functions

###   function IndexedListModel ()
Constructor for an empty list

---


###   IndexedListModel.prototype.updateIDs = function (startindex)
update the ids, starting at the specified index

**Argument:** **startindex**

the index with which to start. Defaults to 0

---


###   IndexedListModel.prototype.oninsert = function (emitter, event, data)
Callback function

**Argument:** **emitter**

should be equal to this
**Argument:** **event**

should be equal to 'insert'
**Argument:** **data**

a data object containing 'id' and 'object' fields

---


###   IndexedListModel.prototype.onremove = function (emitter, event, data)
Callback function

**Argument:** **emitter**

should be equal to this
**Argument:** **event**

should be equal to 'remove'
**Argument:** **data**

a data object containing 'id' and 'object' fields

---

## Metrics

* 66 Lines
* 1678 Bytes

