/**
 * ServerModel
 *
 * @return ServerModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/valuemodel', 'core/statemodel',
    'ui/backgroundscripts/online', 'ui/messagemodel', 'ui/browser'], function(
    extend, Model, ValueModel, StateModel, Online, MessageModel, Browser) {
  /**
   * Constructor
   */
  function ServerModel() {
    ServerModel.superconstructor.call(this);

    this.token = new ValueModel(undefined);
    this.tokenvalid = new ValueModel(undefined);
  }
  extend(ServerModel, Model);

  ServerModel.prototype.validateToken = function() {
    var message;

    if (!this.token.get()) {
      return;
    }
    this.tokenvalid.set(undefined);

    message = this.message('/');

    message.onrecieve = (function(emitter, event, data) {
      if (data.error) {
        this.tokenvalid.set(false);
      } else if (data.valid) {
        this.tokenvalid.set(true);
      }
    }).bind(this);

    message.onerror = (function() {
      this.tokenvalid.set(false);
    }).bind(this);

    message.send();
  };

  ServerModel.prototype.setToken = function(token) {
    this.invalidateToken();
    this.token.set(token);
  };

  ServerModel.prototype.invalidateToken = function() {
    var message;
    if (!this.token.get()) {
      return;
    }

    message = this.message('/token/delete');
    message.send(); // fire and forget

    this.token.set(undefined);
  };

  ServerModel.prototype.message = function(apipath, data) {
    message = new MessageModel(this, apipath, data);

    return message;
  };

  ServerModel.prototype.communicationPossible = function() {
    return Browser.secure && Browser.legit && Online();
  };

  return ServerModel;
});
