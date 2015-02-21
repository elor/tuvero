/**
 * some debugging functions, such as stack trace and whether it's a dev version
 *
 * @return Debug
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./toast', './strings', 'jquery'], function(Toast, Strings, $) {
  var Debug;

  Debug = {
    stackTrace: function() {
      var e, stack;

      e = new Error('dummy');
      stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@');
      console.log(stack);
    },
    isDevVersion: undefined
  };

  $(function($) {
    Debug.isDevVersion = /-dev$/.test($('head title').text().toLowerCase());
    if (Debug.isDevVersion) {
      new Toast(Strings.dev, Toast.INFINITE);
    }
  });

  return Debug;
});
