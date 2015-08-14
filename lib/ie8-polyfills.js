/**
 * Object.create()
 */
if (typeof Object.create != 'function') {
	// Production steps of ECMA-262, Edition 5, 15.2.3.5
	// Reference: http://es5.github.io/#x15.2.3.5
	Object.create = (function() {
		// To save on memory, use a shared constructor
		function Temp() {
		}

		// make a safe reference to Object.prototype.hasOwnProperty
		var hasOwn = Object.prototype.hasOwnProperty;

		return function(O) {
			// 1. If Type(O) is not Object or Null throw a TypeError exception.
			if (typeof O != 'object') {
				throw TypeError('Object prototype may only be an Object or null');
			}

			// 2. Let obj be the result of creating a new object as if by the
			// expression new Object() where Object is the standard built-in
			// constructor with that name
			// 3. Set the [[Prototype]] internal property of obj to O.
			Temp.prototype = O;
			var obj = new Temp();
			Temp.prototype = null; // Let's not keep a stray reference to O...

			// 4. If the argument Properties is present and not undefined, add
			// own properties to obj as if by calling the standard built-in
			// function Object.defineProperties with arguments obj and
			// Properties.
			if (arguments.length > 1) {
				// Object.defineProperties does ToObject on its first argument.
				var Properties = Object(arguments[1]);
				for ( var prop in Properties) {
					if (hasOwn.call(Properties, prop)) {
						obj[prop] = Properties[prop];
					}
				}
			}

			// 5. Return obj
			return obj;
		};
	})();
}

/**
 * addEventListener()
 */
(function() {
	if (!Event.prototype.preventDefault) {
		Event.prototype.preventDefault = function() {
			this.returnValue = false;
		};
	}
	if (!Event.prototype.stopPropagation) {
		Event.prototype.stopPropagation = function() {
			this.cancelBubble = true;
		};
	}
	if (!Element.prototype.addEventListener) {
		var eventListeners = [];

		var addEventListener = function(type, listener /*
														 * , useCapture (will be
														 * ignored)
														 */) {
			var self = this;
			var wrapper = function(e) {
				e.target = e.srcElement;
				e.currentTarget = self;
				if (listener.handleEvent) {
					listener.handleEvent(e);
				} else {
					listener.call(self, e);
				}
			};
			if (type == "DOMContentLoaded") {
				var wrapper2 = function(e) {
					if (document.readyState == "complete") {
						wrapper(e);
					}
				};
				document.attachEvent("onreadystatechange", wrapper2);
				eventListeners.push({
					object : this,
					type : type,
					listener : listener,
					wrapper : wrapper2
				});

				if (document.readyState == "complete") {
					var e = new Event();
					e.srcElement = window;
					wrapper2(e);
				}
			} else {
				this.attachEvent("on" + type, wrapper);
				eventListeners.push({
					object : this,
					type : type,
					listener : listener,
					wrapper : wrapper
				});
			}
		};
		var removeEventListener = function(type, listener /*
															 * , useCapture
															 * (will be ignored)
															 */) {
			var counter = 0;
			while (counter < eventListeners.length) {
				var eventListener = eventListeners[counter];
				if (eventListener.object == this && eventListener.type == type
						&& eventListener.listener == listener) {
					if (type == "DOMContentLoaded") {
						this.detachEvent("onreadystatechange",
								eventListener.wrapper);
					} else {
						this.detachEvent("on" + type, eventListener.wrapper);
					}
					eventListeners.splice(counter, 1);
					break;
				}
				++counter;
			}
		};
		Element.prototype.addEventListener = addEventListener;
		Element.prototype.removeEventListener = removeEventListener;
		if (HTMLDocument) {
			HTMLDocument.prototype.addEventListener = addEventListener;
			HTMLDocument.prototype.removeEventListener = removeEventListener;
		}
		if (Window) {
			Window.prototype.addEventListener = addEventListener;
			Window.prototype.removeEventListener = removeEventListener;
		}
	}
})();