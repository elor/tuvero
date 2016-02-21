/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', './valueview', './storage',
    './storagesavecontroller', './fileloadcontroller', './csvexportcontroller',
    'ui/timemachinecommitview', 'ui/listview', 'timemachine/timemachine'], //
function(extend, $, View, ValueView, Storage, StorageSaveController,
    FileLoadController, CSVExportController, TimeMachineCommitView, ListView,
    TimeMachine) {
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
    var $container, value, $button, $template;

    /*
     * storage save button (NOT file save button)
     */
    $button = this.$view.find('button.savestate');
    this.storageSaveController = new StorageSaveController(new View(undefined,
        $button));

    /*
     * load button
     */
    $button = this.$view.find('input.load.file');
    this.fileLoadController = new FileLoadController(new View(undefined,
        $button));

    /*
     * CSV buttons
     */
    $container = this.$view.find('.csv');
    this.csvExportController = new CSVExportController(new View(undefined,
        $container));

    /*
     * Time Machine Commits
     */
    $container = this.$view.find('.rootcommits');
    $template = $container.find('.timemachinecommitview.template');
    this.initCommits = new ListView(TimeMachine.roots, $container, $template,
        TimeMachineCommitView);
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
