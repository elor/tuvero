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

    this.$anchor = undefined;
    this.$rename = undefined;

    this.view.$view.on('click', '.rename', this.startRename.bind(this));
    this.view.$view.filter('.rename').click(this.startRename.bind(this));
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

  RenameController.prototype.initRenameInput = function() {
    if (!this.$rename) {
      this.$rename = $('<input>').addClass('rename');
      this.$rename.blur(this.endRename.bind(this));
      this.$rename.keydown(this.renameKeyDown.bind(this));
    }
  };

  RenameController.prototype.startRename = function(evt) {
    if (this.$anchor) {
      return;
    }

    this.$anchor = $(evt.target);
    if (!this.$anchor) {
      return;
    }

    this.initRenameInput();

    this.$anchor.before(this.$rename);
    this.$anchor.addClass('hidden');
    this.$rename.val(this.getName());
    this.$rename.focus();

    evt.preventDefault();
    return false;
  };

  RenameController.prototype.endRename = function(evt) {
    var name;

    if (!this.$anchor) {
      return;
    }

    name = this.$rename.val().trim();

    if (this.setName(name)) {
      this.$anchor.removeClass('hidden');
      this.$anchor = undefined;
      this.$rename.detach();
    }

    evt.preventDefault();
    return false;
  };

  RenameController.prototype.renameKeyDown = function(evt) {
    if (!evt || !this.$rename) {
      return;
    }

    switch (evt.which) {
    case 27: // escape
      this.$rename.val(this.getName());
      // deliberate fallthrough
    case 13: // enter
      return this.endRename(evt);
    }
  };

  RenameController.prototype.destroy = function() {
    if (this.$rename) {
      this.$rename.remove();
    }

    RenameController.superclass.destroy.call(this);
  };

  return RenameController;
});
