/**
 * TimeMachineCommitView
 *
 * @return TimeMachineCommitView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import View from '../core/view.js';
import TimeMachine from '../timemachine/timemachine.js';
import ValueModel from '../core/valuemodel.js';
import ValueView from './valueview.js';
import ClassView from '../core/classview.js';
import State from './state.js';
import TimeMachineCommitController from './timemachinecommitcontroller.js';
import BoxView from './boxview.js';
import CheckBoxView from './checkboxview.js';
import StateLinkView from './statelinkview.js';
/**
 * Constructor
 */
function TimeMachineCommitView(model, $view) {
  TimeMachineCommitView.superconstructor.call(this, model, $view);
  this.boxView = new BoxView(this.$view);
  this.nameView = new ValueView(new ValueModel(), this.$view.find('.name'));
  this.startDateView = new ValueView(new ValueModel(), this.$view.find('.startdate'));
  this.saveDateView = new ValueView(new ValueModel(), this.$view.find('.savedate'));
  this.sizeView = new ValueView(new ValueModel(), this.$view.find('.size'));
  this.activeView = new ClassView(new ValueModel(false), this.$view, 'activetree');
  this.updateName();
  this.updateStartDate();
  this.updateSaveDate();
  this.updateSize();
  this.updateActive();
  this.autouploadCheckbox = new CheckBoxView(State.tabOptions.autouploadState, this.$view.find('input.autoupload'));
  this.stateLinkView = new StateLinkView(State.serverlink, this.$view.find('a.statelink'));
  this.controller = new TimeMachineCommitController(this);
  TimeMachine.registerListener(this);
}
extend(TimeMachineCommitView, View);
TimeMachineCommitView.prototype.updateName = function () {
  this.nameView.model.set(this.model.getTreeName());
};
TimeMachineCommitView.prototype.updateStartDate = function () {
  var startDate = new Date(this.model.key.startDate);
  this.startDateView.model.set(startDate.toLocaleString());
};
TimeMachineCommitView.prototype.updateSaveDate = function () {
  var youngestAncestor, saveDate;
  youngestAncestor = this.model.getYoungestDescendant() || this.model;
  saveDate = new Date(youngestAncestor.key.saveDate);
  this.saveDateView.model.set(saveDate.toLocaleString());
};
TimeMachineCommitView.prototype.updateSize = function () {
  var size = TimeMachine.usedRelatedStorage(this.model);
  size = Math.round(size / 102.4) / 10;
  this.sizeView.model.set(size + 'kB');
};
TimeMachineCommitView.prototype.updateActive = function () {
  this.activeView.model.set(TimeMachine.isRelatedToActive(this.model));
};
TimeMachineCommitView.prototype.onsave = function (event, emitter, commit) {
  if (commit.key.isRelated(this.model.key)) {
    this.updateSaveDate();
    this.updateSize();
  }
};
TimeMachineCommitView.prototype.onremove = function (event, emitter, commit) {
  if (commit && !commit.isRoot()) {
    this.updateSaveDate();
    this.updateSize();
  }
};
TimeMachineCommitView.prototype.oninit = function (event, emitter, commit) {
  this.updateActive();
};
TimeMachineCommitView.prototype.onload = function (event, emitter, commit) {
  this.updateActive();
};
TimeMachineCommitView.prototype.oncleanup = function (event, emitter, commit) {
  this.updateSize();
};
TimeMachineCommitView.prototype.onrename = function (event, emitter, newname) {
  this.updateName();
};
TimeMachineCommitView.prototype.destroy = function () {
  this.nameView.destroy();
  this.startDateView.destroy();
  this.saveDateView.destroy();
  this.sizeView.destroy();
  this.nameView.model.destroy();
  this.startDateView.model.destroy();
  this.saveDateView.model.destroy();
  this.sizeView.model.destroy();
  this.boxView.destroy();
  TimeMachineCommitView.superclass.destroy.call(this);
};
export default TimeMachineCommitView;