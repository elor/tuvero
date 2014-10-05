/**
 * a handle to all tabs for update purposes
 */

define([ './tabs' ], function (Tabs) {
  return new Tabs('#tabs > div', '%s', true);
});
