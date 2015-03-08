/**
 * Initializes and returns the Tabs singleton, which manages the tab logic.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['./tabs'], function(Tabs) {
  /*
   * FIXME disabled until the new tabs have been written. Everything will be
   * evented from then on
   */
  return new Tabs('#tabsFIXME > div', '%s', true);
});
