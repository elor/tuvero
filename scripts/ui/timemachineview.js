import View from '../core/view.js';
import TimeMachineCommitView from './timemachinecommitview.js';
import ListView from './listview.js';
import TimeMachine from '../timemachine/timemachine.js';
import TimeMachineNewTreeController from './timemachinenewtreecontroller.js';

/**
 * Constructor
 */
class TimeMachineView extends View {
  constructor($view) {
    super(undefined, $view);
    this.init();
  }

  init() {
    let $container, $template;
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
  }
}

export default TimeMachineView;