/**
 * some debugging functions
 */
define([], function () {
  var Debug;

  Debug = {
    stackTrace : function () {
      var e, stack;

      e = new Error('dummy');
      stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').split('\n');
      console.log(stack);
    }
  };

  return Debug;
});
