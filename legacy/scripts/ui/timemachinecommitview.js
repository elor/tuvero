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
    var startDate, saveDate, youngestAncestor, storageSize, name;

    startDate = new Date(this.model.key.startDate);
    startDate = startDate.toLocaleString();
    saveDate = '';
    youngestAncestor = this.model.getYoungestDescendant();
    if (youngestAncestor) {
      youngestAncestor = new Date(youngestAncestor.key.saveDate);
      saveDate = youngestAncestor.toLocaleString();
    }

    name = this.model.getTreeName();

    storageSize = TimeMachine.usedRelatedStorage(this.model);
    storageSize = Math.round(storageSize / 102.4) / 10;

    this.$view.text(name + ': ' + startDate + ' - ' + saveDate + ' ('
        + storageSize + 'kB)');
  };

  TimeMachineCommitView.prototype.onsave = function(event, emitter, commit) {
    if (commit.key.isRelated(this.model.key)) {
      this.updateText();
    }
  }

  TimeMachineCommitView.prototype.onrename = function(event, emitter, newname) {
    this.updateText();
  }

  return TimeMachineCommitView;
});
