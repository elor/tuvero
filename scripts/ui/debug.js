/**
 * some debugging functions, such as stack trace and whether it's a dev version
 *
 * @return Debug
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
const Debug = {
  stackTrace: function () {
        const e = new Error('dummy')
    const stack = e.stack.replace(/^[^(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
    console.log(stack)
  },
  isDevVersion: undefined
}

// Not waiting for document load. We're just reading a header text, not
// manipulating the DOM. We should be safe.
// $(function($) {
Debug.isDevVersion = !/\s[0-9]+(\.[0-9]+)+(-rc[0-9]*)?$/.test($('head title').text())
// });
export default Debug
