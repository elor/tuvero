/**
 * TimeMachineView
 *
 * @return TimeMachineView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './storagesavecontroller',
    'ui/timemachinecommitview', 'ui/listview', 'timemachine/timemachine',
    'ui/timemachinenewtreecontroller'], function(extend, View,
    StorageSaveController, TimeMachineCommitView, ListView, TimeMachine,
    TimeMachineNewTreeController) {
  /**
   * Constructor
   */
  function TimeMachineView($view) {
    TimeMachineView.superconstructor.call(this, undefined, $view);

    this.init();
  }
  extend(TimeMachineView, View);

  TimeMachineView.prototype.init = function() {
    var $button, $container, $template;
    /*
     * storage save button (NOT file save button)
     */
    $button = this.$view.find('button.savestate');
    this.storageSaveController = new StorageSaveController(new View(undefined,
        $button));

    /*
     * Time Machine Commits
     */
    $container = this.$view.find('.rootcommits');
    $template = $container.find('.timemachinecommitview.template');
    this.initCommits = new ListView(TimeMachine.roots, $container, $template,
        TimeMachineCommitView);

    /*
     * Time Machine New Tree
     */
    $container = this.$view.find('.newcommittree');
    this.newcommitTreeController = new TimeMachineNewTreeController(new View(
        undefined, $container))
  }

  return TimeMachineView;
});
