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
  var STATETRANSITIONS, INITIALSTATE;

  STATETRANSITIONS = {
    'loggedout': ['newtoken', 'trytoken'],
    'trytoken': ['loggedout', 'loggedin'],
    'newtoken': ['loggedin', 'loginrequired', 'error'],
    'loginrequired': ['newtoken', 'loggedout', 'error'],
    'loggedin': ['loggedout', 'error'],
    'error': ['loggedout']
  };
  INITIALSTATE = 'loggedout';

  /**
   * Constructor
   */
  function LoginModel() {
    LoginModel.superconstructor.call(this);

    this.username = new ValueModel('none');
    this.token = new ValueModel('none');
    this.state = new StateValueModel(INITIALSTATE, STATETRANSITIONS);

    this.registerListener(this);
  }
  extend(LoginModel, Model);

  LoginModel.prototype.EVENTS = {
    loginstart: true,
    logincomplete: true,
    loginfailure: true
  };

  LoginModel.prototype.login = function() {
    console.log('login()');
    this.renewToken();
  };

  LoginModel.prototype.logout = function() {
    console.log('logout()');
    if (!this.state.set('loggedout')) {
      console.error('logout failed: wrong state');
    }
    this.token.set('none');
    this.username.set('none');
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
          token.set('none');
          if (state.get() === 'loginrequired') {
            state.set('error');
            emit('loginfailure');
          } else {
            state.set('loginrequired');
            emit('loginstart');
          }
        } else {
          token.set(data.fulltoken);
          state.set('loggedin')
          emit('logincomplete');
        }
      },
      error: function(data) {
        token.set('none');
        state.set('error');
        emit('loginfailure');
      }
    })
  };

  LoginModel.prototype.updateProfile = function() {
    var username, login;

    console.log('updateProfile()');

    if (this.state.get() != 'loggedin') {
      console.log('not logged in!');
    }

    username = this.username;

    if (this.token.get() === 'none') {
      console.log('no token set');
      return;
    }

    $.get('https://api.tuvero.de/profile', 'auth=' + this.token.get(),
        function(profile) {
          console.log('api data:');
          console.log(profile);
          if (profile) {
            if (profile.displayname) {
              username.set(profile.displayname);
            } else {
              console.log('displayname not set in returned shit')
              username.set('none');
            }
          } else {
            console.log('returned user data is empty')
            username.set('none');
          }
        });
  };

  LoginModel.prototype.onlogincomplete = function() {
    this.updateProfile();
  };

  return LoginModel;
});
