/**
 * MessageModel
 *
 * @return MessageModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/valuemodel'], function(extend, Model,
    ValueModel) {
  /**
   * Constructor
   */
  function MessageModel(server, apipath, data) {
    MessageModel.superconstructor.call(this);

    this.server = server;
    this.apipath = apipath;
    this.data = data;

    this.status = new ValueModel('unsent');
    this.result = new ValueModel(undefined);

    this.registerListener(this);
  }
  extend(MessageModel, Model);

  MessageModel.prototype.send = function() {
    if (this.server.tokenvalid.get() === false || !this.server.token.get()) {
      return false;
    }
    if (this.status.get() === 'sent') {
      return false;
    }
    this.result.set(undefined);

    $.ajax({
      method: 'POST',
      url: 'https://api.tuvero.de/' + this.apipath,
      data: 'auth=' + this.server.token.get(),
      timeout: 5000,
      success: (function(data) {
        this.result.set(data);
        if (!data || data.error) {
          this.status.set('error');
          this.emit('error', data);
        } else {
          this.status.set('done');
          this.emit('receive', data);
        }
      }).bind(this),
      error: (function(data) {
        this.result.set(data);
        this.status.set('error');
        this.emit('error', data);
      }).bind(this)
    });

    this.status.set('sent');
    this.emit('send', this.data);

    return true;
  };

  MessageModel.prototype.onsend = function(emitter, event, data) {
  };

  MessageModel.prototype.onreceive = function(emitter, event, data) {
  };

  MessageModel.prototype.onerror = function(emitter, event, data) {
  };

  MessageModel.prototype.EVENTS = {
    'error': true,
    'send': true,
    'receive': true
  };

  return MessageModel;
});
