/**
 * LoginModel
 *
 * @return LoginModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/valuemodel', 'jquery',
    'core/statevaluemodel'], function(extend, Model, ValueModel, $,
    StateValueModel) {
  var STATETRANSITIONS, INITIALSTATE, NULLTOKEN, AJAXTIMEOUT;

  STATETRANSITIONS = {
    'loggedout': ['newtoken', 'trytoken'],
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
      method: 'GET',
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
          state.set('trytoken')
          emit('trytoken');
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

    this.token.set(data.fulltoken);
    this.state.set('trytoken')
    this.emit('trytoken');
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
      method: 'GET',
      url: 'https://api.tuvero.de/profile',
      data: 'auth=' + this.token.get().split('').reverse().join(''),
      timeout: AJAXTIMEOUT,
      success: function(profile) {
        debugger
        if (profile) {
          if (profile.displayname) {
            username.set(profile.displayname);
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
        debugger
        logout();
        state.set('error');
      }
    });
  };

  LoginModel.prototype.ontrytoken = function() {
    this.updateProfile.bind(this);
  };

  return LoginModel;
});
