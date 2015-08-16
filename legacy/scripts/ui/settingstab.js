/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', 'core/valuemodel', './valueview',
    './browser', './storage', './storagesavecontroller'], function(extend, $,
    View, ValueModel, ValueView, Browser, Storage, StorageSaveController) {
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
  function SettingsTab($tab) {
    SettingsTab.superconstructor.call(this, undefined, $tab);

    this.init();
  }
  extend(SettingsTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  SettingsTab.prototype.init = function() {
    var $container, value, $button;

    /*
     * show browser info
     */
    $container = this.$view.find('.savedate');
    this.saveDate = new ValueView(Storage.lastSaved, $container);

    $button = this.$view.find('button.savestate');
    this.storageSaveController = new StorageSaveController(new View(undefined,
        $button));
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="settings"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new SettingsTab($tab);
    }
  });

  return SettingsTab;
});
