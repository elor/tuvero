# scripts/ui/listcollectormodel.js


ListCollectorModel: register to every list element and unregister when it's
removed. passes the emitted events to its own emitter, and adds the original
emitter to the data object as data.source

* Exports: ListCollectorModel
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./listener.html">./listener</a>
* <a href="./model.html">./model</a>

## Functions

###   function ListCollectorModel(list, ContentModel)
Constructor

---


###   ListCollectorModel.prototype.createListListener = function()
create a listener object and bind it to this.

whenever list elements are added or removed, the collector is registered or
unregistered from their emitters

---


###     this.listener.oninsert = function(emitter, event, data)
register to inserted emitters

---


###     this.listener.onremove = function(emitter, event, data)
unregister from removed emitters

---


###   ListCollectorModel.prototype.createEventCallbacks = function(ContentModel)
for every possible event of the ContentModel, add a proxy callback.

See ListCollectorModel.PROXYCALLBACK for a note on how events are passed
through

**Argument:** **ContentModel**

the class of which the list elements are instances

---


###   ListCollectorModel.prototype.registerExistingElements = function()
For every element, register a listener. Should only be used during the
constructor call

---


###   ListCollectorModel.PROXYCALLBACK = function(emitter, event, data)
pass a recieved event through to the own emitter.

The original emitter is written to data.source, unless data.source already
exists, in which case it is assumed that there's a chain of collectors.
Hence, the direct of this event emitter will be discarded in favor of the
original emitter.

---

## Metrics

* 108 Lines
* 3050 Bytes

