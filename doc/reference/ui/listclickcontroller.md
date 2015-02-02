# scripts/ui/listclickcontroller.js


on a list element click, runs the callback function. Can handle other events
as well

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./controller.html">./controller</a>
* lib/extend
* <a href="./valuemodel.html">./valuemodel</a>
* JQuery


## Functions

###   function ListClickController(view, callback, options)
Constructor

The optional argument, options, can contain multiple options:


options.active: a ValueModel instance. When it's false, events are ignored

options.callbackthis: use as the "this" for the callback function

options.event: use this event instead of 'click', e.g. 'mousedown'

options.selector: use this selector instead of '>' to select specific or
deeper nested DOM elements


**Argument:** **view**

a ListView instance
**Argument:** **callback**

the callback function: callback(model, index)
**Argument:** **options**

Optional. An option object. See above

---

## Metrics

* 67 Lines
* 1921 Bytes

