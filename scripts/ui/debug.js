/**
 * some debugging functions, such as stack trace and whether it's a dev version
 *
 * @return Debug
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/toast', 'ui/strings', 'jquery'], function(Toast, Strings, $) {
  var Debug;

  Debug = {
    stackTrace: function() {
      var e, stack;

      e = new Error('dummy');
      stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '')
          .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@');
      console.log(stack);
    },
    isDevVersion: undefined
  };

  // Not waiting for document load. We're just reading a header text, not
  // manipulating the DOM. We should be safe.
  // $(function($) {
  Debug.isDevVersion = !/\s[0-9]+(\.[0-9]+)+(-rc[0-9]*)?$/.test($('head title')
      .text());
  if (Debug.isDevVersion) {
    new Toast(Strings.dev, Toast.INFINITE);
  }
  // });

  return Debug;
});
