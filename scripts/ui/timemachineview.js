/**
 * TimeMachineView
 *
 * @return TimeMachineView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import View from '../core/view.js';
import TimeMachineCommitView from './timemachinecommitview.js';
import ListView from './listview.js';
import TimeMachine from '../timemachine/timemachine.js';
import TimeMachineNewTreeController from './timemachinenewtreecontroller.js';
/**
 * Constructor
 */
function TimeMachineView($view) {
  TimeMachineView.superconstructor.call(this, undefined, $view);
  this.init();
}
extend(TimeMachineView, View);
TimeMachineView.prototype.init = function () {
  var $container, $template;
  /*
   * Time Machine Commits
   */
  $container = this.$view.find('.rootcommits');
  $template = $container.find('.timemachinecommitview.template');
  this.initCommits = new ListView(TimeMachine.roots, $container, $template, TimeMachineCommitView);

  /*
   * Time Machine New Tree
   */
  $container = this.$view.find('.newcommittree');
  this.newcommitTreeController = new TimeMachineNewTreeController(new View(undefined, $container));
};
export default TimeMachineView;