import $ from 'jquery'
import View from '../core/view.js'
import CSVExportController from './csvexportcontroller.js'
import FontSizeView from './fontsizeview.js'

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
class SettingsTab extends View {
  constructor ($tab) {
    super(undefined, $tab)
    this.init()
  }

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  init () {
    this.$fontsizeview = this.$view.find('.fontsizeview').eq(0)
    this.fontsizeview = new FontSizeView(this.$fontsizeview, $('body'))

    /*
     * CSV buttons
     */
    const $container = this.$view.find('.csv')
    this.csvExportController = new CSVExportController(new View(undefined, $container))
  }
}

// FIXME CHEAP HACK AHEAD
$(function ($) {
  const $tab = $('#tabs > [data-tab="settings"]')
  if ($tab.length && $('#testmain').length === 0) {
    return new SettingsTab($tab)
  }
})
export default SettingsTab
