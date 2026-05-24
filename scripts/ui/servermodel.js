/**
 * ServerModel
 *
 * @return ServerModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import Model from '../core/model.js';
import ValueModel from '../core/valuemodel.js';
import Online from '../background/online.js';
import MessageModel from './messagemodel.js';
import Browser from './browser.js';

/**
 * @param  {String} token the API token for the current user
 * @returns {undefined}
 */
class ServerModel extends Model {
  constructor(token) {
    super();
    this.logged_in = new ValueModel(false);
    this.token = new ValueModel(token || undefined);
    this.tokenvalid = new ValueModel(undefined);
    this.openTransactions = new ValueModel(0);
    this.token.registerListener(this);
    this.validateToken();
  }

  validateToken() {
    let message;
    this.tokenvalid.set(undefined);
    if (!this.token.get()) {
      return;
    }
    message = this.message('/');
    message.onreceive = function () {
      this.tokenvalid.set(true);
      this.logged_in.set(true);
      this.emit('login');
    }.bind(this);
    message.onerror = function () {
      this.tokenvalid.set(false);
      this.emit('error');
    }.bind(this);
    message.send();
  }

  setToken(token) {
    this.invalidateToken();
    this.token.set(token);
    this.validateToken();
  }

  createToken(token) {
    this.invalidateToken();
    if (!this.communicationStatus().tuvero) {
      return this.emit('error');
    }
    this.registerMessage();
    $.ajax({
      method: 'POST',
      url: 'https://www.tuvero.de/profile/token/new/json',
      timeout: 5000,
      xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
      success: function (data) {
        if (!data) {
          this.emit('error');
        } else if (data.error) {
          this.emit('authenticate');
        } else {
          this.setToken(data.fulltoken);
        }
      }.bind(this),
      error: this.emit.bind(this, 'error'),
      complete: function () {
        this.unregisterMessage();
      }.bind(this)
    });
  }

  invalidateToken() {
    let message;
    if (!this.token.get()) {
      this.tokenvalid.set(false);
      return;
    }
    message = this.message('/token/delete');
    if (message) {
      message.send(); // fire and forget
    }
    this.token.set(undefined);
    this.tokenvalid.set(undefined);
    this.logged_in.set(false);
    this.emit('logout');
  }

  message(apipath, data) {
    if (this.tokenvalid.get() === false || !this.token.get()) {
      return undefined;
    }
    if (!this.communicationStatus().tuvero) {
      return this.emit('error');
    }

    // tokenvalid can be true or undefined.
    // true: it's deemed valid
    // undefined: validation pending

    return new MessageModel(this, apipath, data);
  }

  registerMessage() {
    this.openTransactions.set(this.openTransactions.get() + 1);
  }

  unregisterMessage() {
    this.openTransactions.set(this.openTransactions.get() - 1);
  }

  communicationStatus() {
    const causes = {
      'https': Browser.secure,
      'tuvero': Browser.legit,
      'online': Online(),
      'validtoken': this.token.get() && this.tokenvalid.get()
    };
    causes.all = Object.keys(causes).every(function (value) {
      return causes[value] === true;
    });
    return causes;
  }

  /**
   * Relay 'update' event from this.token
   *
   * @returns {undefined}
   */
  onupdate() {
    this.emit('update');
  }

  save() {
    const data = super.save();
    data.token = this.token.get() || '';
    return data;
  }

  restore(data) {
    if (!super.restore(data)) {
      return false;
    }
    this.setToken(data.token || undefined);
    return true;
  }
}

ServerModel.prototype.EVENTS = {
  'error': true,
  'authenticate': true,
  'login': true,
  'logout': true,
  'update': true
};
ServerModel.prototype.SAVEFORMAT = Object.create(Model.prototype.SAVEFORMAT);
ServerModel.prototype.SAVEFORMAT.token = String;
export default ServerModel;