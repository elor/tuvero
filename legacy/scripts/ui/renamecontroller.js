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

    this.$rename = undefined;

    this.view.$view.find('.startrename').click(this.startRename.bind(this));
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
    var $anchor;

    this.initRenameInput();

    if (this.$rename.parent().length) {
      return;
    }

    $anchor = $(evt.target);

    $anchor.before(this.$rename);
    this.$rename.val(this.getName());
    this.view.$view.addClass('renaming');

    this.$rename.focus();

    evt.preventDefault();
    return false;
  };

  RenameController.prototype.endRename = function(evt) {
    var name;

    if (!this.$rename) {
      return;
    }

    name = this.$rename.val().trim();

    if (this.setName(name)) {
      this.view.$view.removeClass('renaming');
      this.$rename.remove();
      this.$rename = undefined;
    }

    evt.preventDefault();
    return false;
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
      return this.endRename(evt);
    }
  };

  RenameController.prototype.initRenameInput = function() {
    if (!this.$rename) {
      this.$rename = $('<input>').addClass('rename');
      this.$rename.blur(this.endRename.bind(this));
      this.$rename.click(this.endRename.bind(this));
      this.$rename.keydown(this.renameKeyDown.bind(this));
    }
  };

  return RenameController;
});
