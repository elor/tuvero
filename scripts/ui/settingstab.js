/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', 'ui/csvexportcontroller',
  'ui/fontsizeview'], function (extend, $, View,
  CSVExportController, FontSizeView) {
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
  function SettingsTab ($tab) {
    SettingsTab.superconstructor.call(this, undefined, $tab)

    this.init()
  }
  extend(SettingsTab, View)

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  SettingsTab.prototype.init = function () {
    var $container

    this.$fontsizeview = this.$view.find('.fontsizeview').eq(0)
    this.fontsizeview = new FontSizeView(this.$fontsizeview, $('body'))

    /*
     * CSV buttons
     */
    $container = this.$view.find('.csv')
    this.csvExportController = new CSVExportController(new View(undefined,
      $container))
  }

  // FIXME CHEAP HACK AHEAD
  $(function ($) {
    var $tab

    $tab = $('#tabs > [data-tab="settings"]')
    if ($tab.length && $('#testmain').length === 0) {
      return new SettingsTab($tab)
    }
  })

  return SettingsTab
})
