/**
 * some debugging functions, such as stack trace and whether it's a dev version
 *
 * @return Debug
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import Toast from './toast.js';
import Strings from './strings.js';
import $ from 'jquery';
var Debug;
Debug = {
  stackTrace: function () {
    var e, stack;
    e = new Error('dummy');
    stack = e.stack.replace(/^[^(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@');
    console.log(stack);
  },
  isDevVersion: undefined
};

// Not waiting for document load. We're just reading a header text, not
// manipulating the DOM. We should be safe.
// $(function($) {
Debug.isDevVersion = !/\s[0-9]+(\.[0-9]+)+(-rc[0-9]*)?$/.test($('head title').text());
if (Debug.isDevVersion) {
  Toast.once(Strings.dev, Toast.INFINITE);
}
// });
export default Debug;