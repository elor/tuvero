/**
 * RenameController
 *
 * @return RenameController
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
  function RenameController(view) {
    RenameController.superconstructor.call(this, view);

    this.$rename = this.view.$view.find('input.rename');

    this.view.$view.find('.startrename').click(this.startRename.bind(this));
    this.$rename.blur(this.endRename.bind(this));
    this.$rename.click(this.endRename.bind(this));
    this.$rename.keydown(this.renameKeyDown.bind(this));
  }
  extend(RenameController, Controller);

  RenameController.prototype.setName = function(name) {
    console.error('setName() needs to be overloaded');
    return false;
  };

  RenameController.prototype.getName = function() {
    console.error('getName() needs to be overloaded');
    return 'overload RenameController.prototype.getName()!';
  };

  RenameController.prototype.startRename = function(evt) {
    this.$rename.val(this.getName());

    this.view.$view.addClass('renaming');

    this.$rename.focus();

    if (evt) {
      evt.preventDefault();
      return false;
    }
  };

  RenameController.prototype.endRename = function(evt) {
    name = this.$rename.val().trim();

    if (this.setName(name)) {
      this.view.$view.removeClass('renaming');
    }

    if (evt) {
      evt.preventDefault();
      return false;
    }
  };

  RenameController.prototype.renameKeyDown = function(evt) {
    if (!evt) {
      return;
    }

    switch (evt.which) {
    case 27: // escape
      this.$rename.val(this.getName());
      // deliberate fallthrough
    case 13: // enter
      this.endRename();
      break;
    }
  };

  return RenameController;
});
