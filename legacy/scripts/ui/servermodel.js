/**
 * ServerModel
 *
 * @return ServerModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/valuemodel', 'core/statevaluemodel',
    'ui/backgroundscripts/online', 'ui/messagemodel', 'ui/browser'], function(
    extend, Model, ValueModel, StateValueModel, Online, MessageModel, Browser) {
  /**
   * Constructor
   */
  function ServerModel(token) {
    ServerModel.superconstructor.call(this);

    this.token = new ValueModel(token || undefined);
    this.tokenvalid = new ValueModel(undefined);
    this.openTransactions = new ValueModel(0);

    this.token.registerListener(this);
    this.validateToken();
  }
  extend(ServerModel, Model);

  ServerModel.prototype.EVENTS = {
    'error': true,
    'authenticate': true,
    'login': true,
    'logout': true,
    'update': true
  };

  ServerModel.prototype.validateToken = function() {
    var message;

    this.tokenvalid.set(undefined);

    if (!this.token.get()) {
      return;
    }

    message = this.message('/');

    message.onreceive = (function() {
      this.tokenvalid.set(true);
      this.emit('login');
    }).bind(this);

    message.onerror = (function() {
      this.tokenvalid.set(false);
      this.emit('error');
    }).bind(this);

    message.send();
  };

  ServerModel.prototype.setToken = function(token) {
    this.invalidateToken();
    this.token.set(token);
    this.validateToken();
  };

  ServerModel.prototype.createToken = function(token) {
    this.invalidateToken();

    this.registerMessage();

    $.ajax({
      method: 'POST',
      url: 'https://turniere.tuvero.de/profile/token/new/json',
      timeout: 5000,
      xhrFields: {
        withCredentials: true
      },
      success: (function(data) {
        if (!data) {
          this.emit('error');
        } else if (data.error) {
          this.emit('authenticate');
        } else {
          this.setToken(data.fulltoken);
        }
      }).bind(this),
      error: this.emit.bind(this, 'error'),
      complete: (function() {
        this.unregisterMessage();
      }).bind(this)
    });
  };

  ServerModel.prototype.invalidateToken = function() {
    var message;

    if (!this.token.get()) {
      this.tokenvalid.set(false);
      return;
    }

    message = this.message('/token/delete');
    message.send(); // fire and forget

    this.token.set(undefined);
    this.tokenvalid.set(undefined);

    this.emit('logout');
  };

  ServerModel.prototype.message = function(apipath, data) {
    if (this.tokenvalid.get() === false || !this.token.get()) {
      return undefined;
    }

    // tokenvalid can be true or undefined.
    // true: it's deemed valid
    // undefined: validation pending

    message = new MessageModel(this, apipath, data);

    return message;
  };

  ServerModel.prototype.registerMessage = function() {
    this.openTransactions.set(this.openTransactions.get() + 1);
  };

  ServerModel.prototype.unregisterMessage = function() {
    this.openTransactions.set(this.openTransactions.get() - 1);
  };

  ServerModel.prototype.communicationStatus = function() {
    var causes = {
      'https': Browser.secure,
      'tuvero': Browser.legit,
      'online': Online(),
      'validtoken': this.token.get() && this.tokenvalid.get()
    };

    causes.all = Object.keys(causes).every(function(value) {
      return causes[value] == true;
    });

    return causes;
  };

  /**
   * Relay 'update' event from this.token
   */
  ServerModel.prototype.onupdate = function() {
    this.emit('update');
  };

  ServerModel.prototype.save = function() {
    var data = ServerModel.superclass.save.call(this);

    data.token = this.token.get();
  };

  ServerModel.prototype.restore = function(data) {
    if (!ServerModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.setToken(data.token || undefined);

    return true;
  };

  ServerModel.prototype.SAVEFORMAT = Object
      .create(ServerModel.superclass.SAVEFORMAT);
  ServerModel.prototype.SAVEFORMAT.token = String;

  return ServerModel;
});
