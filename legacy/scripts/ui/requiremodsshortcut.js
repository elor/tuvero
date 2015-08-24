/**
 * RequireModsShortcut
 *
 * @return RequireModsShortcut
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model'], function(extend, Model) {
  /**
   * Constructor
   */
  function RequireModsShortcut() {
    RequireModsShortcut.superconstructor.call(this);
    window.setTimeout(this.createModsObject.bind(this), 1);
  }
  extend(RequireModsShortcut, Model);

  RequireModsShortcut.prototype.createModsObject = function() {
    var rjsdef, mods;

    if (window.mods !== undefined) {
      return;
    }

    rjsdef = require.s.contexts._.defined;
    if (!rjsdef) {
      console.error('require.s.contexts._.defined is undefined');
      return;
    }

    mods = window.mods = {};

    // add every key to mods, which is similar to the directory tree
    Object.keys(rjsdef).forEach(function(key) {
      var keyparts, subobject;

      keyparts = key.split('/');
      subobject = mods;

      // search the position of the key, add new objects as necessary
      keyparts.forEach(function(part, partid) {
        if (partid >= keyparts.length - 1) {
          subobject[part] = rjsdef[key];

        } else {
          if (subobject[part] === undefined) {
            subobject[part] = {};
          }

          subobject = subobject[part];
        }
      });
    });
  }

  return RequireModsShortcut;
});
