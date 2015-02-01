# scripts/ui/classview.js


ClassView, a class which sets CSS classes according to
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./view.html">./view</a>

## Functions

###   function ClassView(model, $view, onclass, offclass)
Constructor

**Argument:** **model**

a boolean ValueModel instance
**Argument:** **$view**

the DOM element for which to change the classes
**Argument:** **onclass**

Optional. the class when model.get() returns true
**Argument:** **offclass**

Optional. the class when model.get() returns false

---


###   ClassView.prototype.update = function()
set or remove the classes according to model.get()

---


###   ClassView.prototype.onupdate = function()
Callback function

---

## Metrics

* 59 Lines
* 1425 Bytes

