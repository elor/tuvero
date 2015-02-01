# scripts/ui/valueview.js


A ValueView, which updates the value of ValueModel to the DOM

* Exports: ValueView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./view.html">./view</a>

## Functions

###   function ValueView(model, $view)
Constructor

**Argument:** **model**

a ValueModel instance, which implements get() and emits update
**Argument:** **$view**

the associated DOM element

---


###   ValueView.prototype.update = function()
write the contents of get() to the DOM

---


###   ValueView.prototype.onupdate = function()
Callback listener

---

## Metrics

* 42 Lines
* 858 Bytes

