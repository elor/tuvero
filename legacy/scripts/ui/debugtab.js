/**
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ 'lib/extend', 'jquery', 'core/view', 'core/valuemodel', './valueview',
    './browser', './storage', './strings', './toast' ], function(extend, $,
    View, ValueModel, ValueView, Browser, Storage, Strings, Toast) {
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
  function DebugTab($tab) {
    DebugTab.superconstructor.call(this, undefined, $tab);

    this.init();
  }
  extend(DebugTab, View);

  /**
   * initialize the tab functionality
   * 
   * TODO maybe split it into multiple autodetected functions?
   */
  DebugTab.prototype.init = function() {
    var $container, value;

    /*
     * show browser name
     */
    value = new ValueModel(Browser.name);
    $container = this.$view.find('.browser .name');
    this.browserNameView = new ValueView(value, $container);

    /*
     * show browser version
     */
    value = new ValueModel(Browser.version);
    $container = this.$view.find('.browser .version');
    this.browserVersionView = new ValueView(value, $container);

    /*
     * button: clear all
     */
    $container = this.$view.find('.register .delete');
    $container.click(function() {
      Storage.clear();
      Storage.store();
      new Toast(Strings.reset);
    });

    // TODO register teams
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="debug"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new DebugTab($tab);
    }
  });

  return DebugTab;
});
