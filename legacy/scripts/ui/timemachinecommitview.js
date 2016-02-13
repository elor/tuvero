/**
 * TimeMachineCommitView
 *
 * @return TimeMachineCommitView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'timemachine/timemachine'], function(extend,
    View, TimeMachine) {
  /**
   * Constructor
   */
  function TimeMachineCommitView(model, $view) {
    TimeMachineCommitView.superconstructor.call(this, model, $view);

    this.updateText();

    TimeMachine.registerListener(this);
  }
  extend(TimeMachineCommitView, View);

  TimeMachineCommitView.prototype.updateText = function() {
    var startDate, saveDate, youngestAncestor;

    startDate = new Date(this.model.key.startDate);
    startDate = startDate.toLocaleString();
    saveDate = '';
    youngestAncestor = this.model.getYoungestAncestor();
    if (youngestAncestor) {
      youngestAncestor = new Date(youngestAncestor.key.saveDate);
      saveDate = youngestAncestor.toLocaleString();
    }

    this.$view.text(startDate + ' - ' + saveDate);
  };

  TimeMachineCommitView.prototype.onsave = function(event, emitter, commit) {
    if (commit.key.isRelated(this.model.key)) {
      this.updateText();
    }
  }

  return TimeMachineCommitView;
});
