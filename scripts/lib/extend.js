!function(a,b){if("object"==typeof exports)module.exports=b(require,exports,module);else if("function"==typeof define&&define.amd)define(["require","exports","module"],b);else{var c=function(b){return a[b]},d=a,e={exports:d};a.extend=b(c,d,e)}}(this,function(a,b,c){function d(a,b){"use strict";function c(){}return c.prototype=b.prototype,a.prototype=new c,a.prototype.constructor=a,a.superclass=b.prototype,a.superconstructor=b,a}return d.isSubclass=function(a,b){"use strict";if("function"==typeof b&&"function"==typeof a)for(var c=a;c=c.superconstructor;)if(c===b)return!0;return!1},c.exports=d,d});