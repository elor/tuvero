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
  var STATETRANSITIONS, INITIALSTATE, NULLTOKEN;

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

    $.get('https://api.tuvero.de/profile', 'auth=' + this.token.get().split('').reverse().join(''),
        function(profile) {
          if (profile) {
            if (profile.displayname) {
              username.set(profile.displayname);
              state.set('loggedin');
              emit('logincomplete');
            } else {
              console.log('displayname not set in returned data')
              logout();
            }
          } else {
            console.log('returned user data is empty')
            logout();
          }
        });
  };

  LoginModel.prototype.ontrytoken = function() {
    window.setTimeout(this.updateProfile.bind(this), 500);
  };

  return LoginModel;
});
