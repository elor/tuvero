/**
 * MessageModel
 *
 * @return MessageModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/model', 'core/valuemodel'], function (
  $, extend, Model, ValueModel) {
  /**
   * Constructor
   */
  function MessageModel (server, apipath, data) {
    MessageModel.superconstructor.call(this)

    this.server = server
    this.apipath = apipath
    this.data = data

    this.status = new ValueModel('unsent')
    this.result = new ValueModel(undefined)

    this.registerListener(this)
  }
  extend(MessageModel, Model)

  MessageModel.prototype.send = function () {
    var server = this.server

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
      url: 'https://api.tuvero.de/' + this.apipath,
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

  MessageModel.prototype.onsend = function (emitter, event, data) {
  }

  MessageModel.prototype.onreceive = function (emitter, event, data) {
  }

  MessageModel.prototype.onerror = function (emitter, event, data) {
  }

  MessageModel.prototype.oncomplete = function (emitter, event, data) {

  }

  MessageModel.prototype.EVENTS = {
    'error': true,
    'send': true,
    'receive': true,
    'complete': true
  }

  return MessageModel
})
