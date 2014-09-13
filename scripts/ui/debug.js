/**
 * some debugging functions
 */
define([ './toast', './strings' ], function (Toast, Strings) {
  var Debug;

  Debug = {
    stackTrace : function () {
      var e, stack;

      e = new Error('dummy');
      stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@');
      console.log(stack);
    },
    isDevVersion : undefined,
  };

  $(function ($) {
    Debug.isDevVersion = /%version%/.test($('head title').text().toLowerCase());
    if (Debug.isDevVersion) {
      new Toast(Strings.dev, Toast.INFINITE);
    }
  });

  return Debug;
});
