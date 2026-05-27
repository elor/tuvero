import Model from '../core/model.js'
import ListModel from './listmodel.js'

/**
 * Constructor
 *
 * @param list
 *          another ListModel instance
 */
class ReadonlyListModel extends Model {
  constructor (list) {
    super()
    this.list = list
    this.length = this.list.length
    this.list.registerListener(this)
  }

  get () {
    return this.list.get.apply(this.list, arguments)
  }

  indexOf () {
    return this.list.indexOf.apply(this.list, arguments)
  }

  map () {
    return this.list.map.apply(this, arguments)
  }

  asArray () {
    return this.list.asArray.apply(this.list, arguments)
  }

  updateLength () {
    this.length = this.list.length
  }

  /**
   * Callback function: called when an 'insert' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  oninsert (emitter, event, data) {
    this.emit(event, data)
  }

  /**
   * Callback function: called when a 'remove' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  onremove (emitter, event, data) {
    this.emit(event, data)
  }

  /**
   * Callback function: called when a 'reset' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  onreset (emitter, event, data) {
    this.emit(event, data)
  }

  /**
   * Callback function: called when a 'reset' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  onresize (emitter, event, data) {
    this.updateLength()
    this.emit(event, data)
  }
}

ReadonlyListModel.prototype.EVENTS = ListModel.prototype.EVENTS
ReadonlyListModel.prototype.forEach = ReadonlyListModel.prototype.map
export default ReadonlyListModel
