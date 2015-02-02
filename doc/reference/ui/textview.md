# scripts/ui/textview.js


Generic View for filling a DOM element with text

* Exports: TextView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./view.html">./view</a>

## Functions

###   function TextView(text, $view)
constructor

**Argument:** **text**

the initial text
**Argument:** **$view**

the containing DOM element

---


###   TextView.prototype.setText = function(text)
change the text of this element

**Argument:** **text**

the new text

---


###   TextView.prototype.reset = function()
reset the text to an empty string

---


###   TextView.prototype.update = function()
write the current text to the DOM element

---


###   TextView.prototype.onupdate = function()
Callback listener

---

## Metrics

* 60 Lines
* 1133 Bytes

