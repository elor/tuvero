/**
 * RenameController
 *
 * @return RenameController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
import TimeMachine from '../timemachine/timemachine.js';
import StateLoader from './stateloader.js';
import Strings from './strings.js';
import Toast from './toast.js';
import FileSaverModel from './filesavermodel.js';
/**
 * Constructor
 */
function RenameController(view, mouseSupport) {
  let events;
  RenameController.superconstructor.call(this, view);
  this.$anchor = undefined;
  this.$rename = undefined;
  this.mouseSupport = !!mouseSupport;
  events = 'click' + (this.mouseSupport ? ' mouseenter' : '');
  this.view.$view.on(events, '.rename', this.startRename.bind(this));
  this.view.$view.filter('.rename').on(events, this.startRename.bind(this));
}
extend(RenameController, Controller);
RenameController.prototype.setName = function (name) {
  console.error('setName() needs to be overloaded');
  return false;
};
RenameController.prototype.getName = function () {
  console.error('getName() needs to be overloaded');
  return 'overload RenameController.prototype.getName()!';
};
RenameController.prototype.initRenameInput = function () {
  if (!this.$rename) {
    this.$rename = $('<input>').addClass('rename');
    this.$rename.on('blur' + (this.mouseSupport ? ' mouseleave' : ''), this.endRename.bind(this));
    this.$rename.keydown(this.renameKeyDown.bind(this));
  }
};
RenameController.prototype.startRename = function (evt) {
  let name;
  if (this.$anchor) {
    return;
  }
  this.$anchor = $(evt.target);
  if (!this.$anchor) {
    return;
  }
  name = this.getName();
  if (name === undefined) {
    this.$anchor = undefined;
    return;
  }
  this.initRenameInput();
  this.$anchor.before(this.$rename);
  this.$anchor.addClass('hidden');
  this.$rename.val(name);
  this.$rename.focus();
  evt.preventDefault();
  return false;
};
RenameController.prototype.endRename = function (evt) {
  let name;
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
RenameController.prototype.renameKeyDown = function (evt) {
  if (!evt || !this.$rename) {
    return;
  }
  switch (evt.which) {
    case 27:
      // escape
      this.$rename.val(this.getName());
      return this.endRename(evt);
    case 13:
      // enter
      return this.endRename(evt);
  }
};
RenameController.prototype.destroy = function () {
  if (this.$rename) {
    this.$rename.remove();
  }
  RenameController.superclass.destroy.call(this);
};
export default RenameController;