/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view'], function(extend, View) {
  /**
   * represents a whole team tab
   *
   * TODO write a TabView superclass with common functions
   *
   * TODO isolate common tab-related function
   *
   * @param $tab
   *          the tab DOM element
   */
  function NewTab($tab) {
    NewTab.superconstructor.call(this, undefined, $tab);

    this.init();
  }
  extend(NewTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  NewTab.prototype.init = function() {
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="new"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new NewTab($tab);
    }
  });

  return NewTab;
});
