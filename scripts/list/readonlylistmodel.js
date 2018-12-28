/**
 * ReadonlyListModel
 *
 * @return ReadonlyListModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'list/listmodel'], function (extend, Model,
  ListModel) {
  /**
   * Constructor
   *
   * @param list
   *          another ListModel instance
   */
  function ReadonlyListModel (list) {
    ReadonlyListModel.superconstructor.call(this)

    this.list = list
    this.length = this.list.length

    this.list.registerListener(this)
  }
  extend(ReadonlyListModel, Model)

  ReadonlyListModel.prototype.EVENTS = ListModel.prototype.EVENTS

  ReadonlyListModel.prototype.get = function () {
    return this.list.get.apply(this.list, arguments)
  }

  ReadonlyListModel.prototype.indexOf = function () {
    return this.list.indexOf.apply(this.list, arguments)
  }

  ReadonlyListModel.prototype.map = function () {
    return this.list.map.apply(this, arguments)
  }

  ReadonlyListModel.prototype.asArray = function () {
    return this.list.asArray.apply(this.list, arguments)
  }

  ReadonlyListModel.prototype.updateLength = function () {
    this.length = this.list.length
  }

  /**
   * Callback function: called when an 'insert' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  ReadonlyListModel.prototype.oninsert = function (emitter, event, data) {
    this.emit(event, data)
  }

  /**
   * Callback function: called when a 'remove' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  ReadonlyListModel.prototype.onremove = function (emitter, event, data) {
    this.emit(event, data)
  }

  /**
   * Callback function: called when a 'reset' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  ReadonlyListModel.prototype.onreset = function (emitter, event, data) {
    this.emit(event, data)
  }

  /**
   * Callback function: called when a 'reset' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  ReadonlyListModel.prototype.onresize = function (emitter, event, data) {
    this.updateLength()
    this.emit(event, data)
  }

  return ReadonlyListModel
})
