/**
 * MessageModel
 *
 * @return MessageModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model'], function(extend, Model) {
  /**
   * Constructor
   */
  function MessageModel(server, apipath, data) {
    MessageModel.superconstructor.call(this);
    this.server = server;
    this.apipath = apipath;
    this.data = data;

    this.registerListener(this);
  }
  extend(MessageModel, Model);

  MessageModel.prototype.send = function() {
    $.ajax({
      method: 'POST',
      url: 'https://api.tuvero.de/profile',
      data: 'auth=' + this.server.token.get(),
      timeout: 5000,
      success: (function(data) {
        if (data !== undefined && data !== '') {
          this.emit('recieve', data);
        } else {
          this.emit('error', data);
        }
      }).bind(this),
      error: (function(data) {
        this.emit('error', data);
      }).bind(this)
    });

    this.emit('send', this.data);
  };

  MessageModel.prototype.onsend = function(emitter, event, data) {
  };

  MessageModel.prototype.onrecieve = function(emitter, event, data) {
  };

  MessageModel.prototype.onerror = function(emitter, event, data) {
  };

  MessageModel.prototype.EVENTS = {
    'error': true,
    'send': true,
    'recieve': true
  };

  return MessageModel;
});
