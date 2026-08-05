/**
 * MessageModel
 *
 * @return MessageModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Model from '../core/model.js'
import ValueModel from '../core/valuemodel.js'

/**
 * Constructor
 */
class MessageModel extends Model {
  constructor (server, apipath, data) {
    super()
    this.server = server
    this.apipath = apipath
    this.data = data
    this.status = new ValueModel('unsent')
    this.result = new ValueModel(undefined)
    this.registerListener(this)
  }

  send () {
    const server = this.server
    if (this.server.tokenvalid.get() === false || !this.server.token.get()) {
      return false
    }
    if (this.status.get() === 'sent') {
      return false
    }
    this.result.set(undefined)
    this.server.registerMessage()
    $.ajax({
      method: 'POST',
      url: (window.TUVERO_API_ORIGIN || (window.location.origin + '/api')).replace(/\/$/, '') + '/' + this.apipath,
      data: JSON.stringify(this.data),
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + server.token.get())
      },
      xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
      contentType: 'application/json; charset=utf8',
      processData: false,
      timeout: 10000,
      success: function (data) {
        this.result.set(data)
        if (!data || data.error) {
          this.status.set('error')
          this.emit('error', data)
        } else {
          this.status.set('done')
          this.emit('receive', data)
        }
      }.bind(this),
      error: function (data) {
        this.result.set(data)
        this.status.set('error')
        this.emit('error', data)
      }.bind(this),
      complete: function (data) {
        this.server.unregisterMessage()
        this.emit('complete', data)
      }.bind(this)
    })
    this.status.set('sent')
    this.emit('send', this.data)
    return true
  }

  onsend (emitter, event, data) {}
  onreceive (emitter, event, data) {}
  onerror (emitter, event, data) {}
  oncomplete (emitter, event, data) {}
}

MessageModel.prototype.EVENTS = {
  error: true,
  send: true,
  receive: true,
  complete: true
}
export default MessageModel
