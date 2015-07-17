/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

/*
 * Tab Test
 */
define(function() {
  return function(QUnit, getModule) {
    var Implements, Tab, Tab_Settings, Autocomplete, Alltabs, Tab_Debug;

    Implements = getModule('lib/implements');
    Tab = getModule('ui/tab');
    Tab_Settings = getModule('ui/tab_settings');
    Autocomplete = getModule('ui/autocomplete');
    Alltabs = getModule('ui/alltabs');
    Tab_Debug = getModule('ui/tab_debug');

    QUnit.test('Tab Implements', function() {

      QUnit.equal(Implements(Tab), '', 'Tab is an interface');

      QUnit.equal(Implements(Tab, Tab_Settings, 'frm'), '',
          'Tab_Settings interface match');
      QUnit.equal(Implements(Tab, Tab_Debug, 'frm'), '',
          'Tab_Debug interface match');
      QUnit.equal(Implements(Tab, Alltabs, 'frm'), '',
          'Alltabs interface match');

      QUnit.equal(Implements({
        Interface: {
          clear: function() {
          },
          reset: function() {
          },
          update: function() {
          }
        }
      }, Autocomplete, 'frm'), '', 'Autocomplete interface match');
    });
  };
});
