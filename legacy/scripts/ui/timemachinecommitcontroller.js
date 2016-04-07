/**
 * TimeMachineCommitController
 *
 * @return TimeMachineCommitController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'timemachine/timemachine',
    'ui/stateloader', 'ui/strings', 'ui/toast', 'ui/filesavermodel'], //
function(extend, Controller, TimeMachine, StateLoader, Strings, Toast,
    FileSaverModel) {
  /**
   * Constructor
   */
  function TimeMachineCommitController(view) {
    TimeMachineCommitController.superconstructor.call(this, view);

    this.$rename = this.view.$view.find('input.rename');

    this.view.$view.find('button.removecommit').click(this.remove.bind(this));
    this.view.$view.find('button.loaddescendant').click(this.load.bind(this));
    this.view.$view.find('button.cleanuptree').click(this.cleanup.bind(this));
    this.view.$view.find('button.download').click(this.download.bind(this));

    this.view.$view.find('.name').click(this.startRename.bind(this));
    this.$rename.blur(this.endRename.bind(this));
    this.$rename.click(this.endRename.bind(this));
    this.$rename.keydown(this.renameKey.bind(this));
  }
  extend(TimeMachineCommitController, Controller);

  TimeMachineCommitController.prototype.remove = function() {
    var active, confirmtext, name;

    active = TimeMachine.isRelatedToActive(this.model);
    name = this.model.getTreeName() || 'noname';

    confirmtext = active ? Strings.confirmactivetreeremoval
        : Strings.confirmtreeremoval;

    if (window.confirm(confirmtext.replace('%s', name))) {

      this.model.remove();

      if (active) {
        StateLoader.unload();
      }
    }
  };

  TimeMachineCommitController.prototype.cleanup = function() {
    TimeMachine.cleanup(this.model, 0);
  };

  TimeMachineCommitController.prototype.load = function() {
    StateLoader.loadCommit(this.model.getYoungestDescendant() || this.model);
  };

  TimeMachineCommitController.prototype.download = function() {
    var fileSaver;

    fileSaver = new FileSaverModel(this.model.getYoungestDescendant()
        || this.model);
    if (!fileSaver.save()) {
      new Toast(Strings.savefailed);
    }
  };

  TimeMachineCommitController.prototype.rename = function(name) {
    name = name.trim();
    if (name != this.model.getTreeName()) {
      this.model.setTreeName(name);
    }
  }

  TimeMachineCommitController.prototype.startRename = function(evt) {
    this.$rename.val(this.model.getTreeName());

    this.view.$view.addClass('renaming');

    this.$rename.focus();

    if (evt) {
      evt.preventDefault();
      return false;
    }
  };

  TimeMachineCommitController.prototype.endRename = function(evt) {
    this.rename(this.$rename.val());

    this.view.$view.removeClass('renaming');

    if (evt) {
      evt.preventDefault();
      return false;
    }
  };

  TimeMachineCommitController.prototype.renameKey = function(evt) {
    if (!evt) {
      return;
    }

    switch (evt.which) {
    case 27: // escape
      this.$input.val(this.model.getTreeName());
    case 13: // enter
      this.endRename();
      break;
    }
  };

  return TimeMachineCommitController;
});
