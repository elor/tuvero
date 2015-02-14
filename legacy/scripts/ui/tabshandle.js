/**
 * Initializes and returns the Tabs singleton, which manages the tab logic.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['./tabs'], function(Tabs) {
  return new Tabs('#tabs > div', '%s', true);
});
