/**
 * LoginModel
 *
 * @return LoginModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/valuemodel', 'jquery',
    'core/statevaluemodel', 'core/listener'], function(extend, Model,
    ValueModel, $, StateValueModel, Listener) {
  var STATETRANSITIONS, INITIALSTATE, NULLTOKEN, AJAXTIMEOUT;

  STATETRANSITIONS = {
    'loggedout': ['newtoken', 'trytoken', 'error'],
    'newtoken': ['trytoken', 'loginrequired', 'error'],
    'trytoken': ['loggedout', 'loggedin'],
    'loginrequired': ['newtoken', 'loggedout', 'error'],
    'loggedin': ['loggedout', 'error'],
    'error': ['loggedout']
  };
  INITIALSTATE = 'loggedout';

  NULLTOKEN = undefined;
  AJAXTIMEOUT = 10000;

  /**
   * Constructor
   */
  function LoginModel() {
    LoginModel.superconstructor.call(this);

    this.state = new StateValueModel(INITIALSTATE, STATETRANSITIONS);
    this.token = new ValueModel(NULLTOKEN);
    this.username = new ValueModel(NULLTOKEN);

    this.registerListener(this);

    Listener.bind(this.token, 'update', function() {
      if (this.token.get() !== NULLTOKEN) {
        this.state.set('trytoken')
        this.emit('trytoken');
      }
    }, this);

    LoginModel.singleton = this;
  }
  extend(LoginModel, Model);

  LoginModel.prototype.EVENTS = {
    loginstart: true,
    trytoken: true,
    logincomplete: true,
    loginfailure: true
  };

  LoginModel.prototype.login = function() {
    // TODO check if token is set
    if (this.state.get() !== 'loggedout') {
      this.logout();
    }
    console.log('login()');
    this.renewToken();
  };

  LoginModel.prototype.logout = function() {
    console.log('logout()');

    if (this.state.get('loggedout')) {
      console.log('already logged out');
    }
    if (!this.state.set('loggedout')) {
      console.error('logout failed: wrong state');
    }
    this.token.set(NULLTOKEN);
    this.username.set(NULLTOKEN);
  };

  LoginModel.prototype.renewToken = function() {
    var token, emit, state;

    if (!this.state.set('newtoken')) {
      this.state.set('error');
      console.log('newtoken set() failed');
      return false;
    }
    token = this.token;
    state = this.state;
    emit = this.emit.bind(this);

    $.ajax({
      method: 'POST',
      url: 'https://turniere.tuvero.de/profile/token/new/json',
      timeout: AJAXTIMEOUT,
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        if (data.error) {
          token.set(NULLTOKEN);
          if (state.get() === 'loginrequired') {
            state.set('error');
            emit('loginfailure');
          } else {
            state.set('loginrequired');
            emit('loginstart');
          }
        } else {
          token.set(data.fulltoken);
        }
      },
      error: function(data) {
        token.set(NULLTOKEN);
        state.set('error');
        emit('loginfailure');
      }
    })
  };

  LoginModel.prototype.tryToken = function(token) {
    this.logout();

    this.token.set(token);
  };

  LoginModel.prototype.updateProfile = function() {
    var username, logout, emit, state;

    console.log('updateProfile()');

    if (this.token.get() === NULLTOKEN) {
      console.log('no token set');
      this.logout();
      return;
    }

    username = this.username;
    logout = this.logout.bind(this);
    emit = this.emit.bind(this);
    state = this.state;

    $.ajax({
      method: 'POST',
      url: 'https://api.tuvero.de/profile',
      data: 'auth=' + this.token.get(),
      timeout: AJAXTIMEOUT,
      success: function(data) {
        if (data) {
          if (data.displayname) {
            username.set(data.displayname);
            state.set('loggedin');
            emit('logincomplete');
            return;
          } else {
            console.log('displayname not set in returned data')
          }
        } else {
          console.log('returned user data is empty')
        }
        logout();
        state.set('error');
      },
      error: function(data) {
        logout();
        state.set('error');
      }
    });
  };

  LoginModel.prototype.ontrytoken = function() {
    this.updateProfile();
  };

  LoginModel.prototype.save = function() {
    var data = LoginModel.superclass.save.call(this);

    // TODO scramble token to guard against simple attacks

    data.token = this.token.get() || '';

    return data;
  };

  LoginModel.prototype.restore = function(data) {
    if (!TournamentModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.tryToken(data.token || undefined);

    return true;
  };

  LoginModel.prototype.SAVEFORMAT = Object
      .create(LoginModel.superclass.SAVEFORMAT);
  LoginModel.prototype.SAVEFORMAT.token = String;

  return LoginModel;
});
