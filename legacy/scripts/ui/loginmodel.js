/**
 * LoginModel
 *
 * @return LoginModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/valuemodel', 'jquery'], function(
    extend, Model, ValueModel, $) {
  /**
   * Constructor
   */
  function LoginModel() {
    LoginModel.superconstructor.call(this);

    this.username = new ValueModel(undefined);
    this.token = new ValueModel(undefined);
    this.loggingIn = new ValueModel(false);
  }
  extend(LoginModel, Model);

  LoginModel.prototype.EVENTS = {
    loginstart: true,
    logincomplete: true,
    loginfailure: true
  };

  LoginModel.prototype.login = function() {
    this.renewToken();
  };

  LoginModel.prototype.renewToken = function() {
    var token, emit, loggingIn;

    token = this.token;
    loggingIn = this.loggingin;
    emit = this.emit.bind(this);

    $.ajax({
      method: 'GET',
      url: 'https://turniere.tuvero.de/profile/token/new/json',
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        if (data.error) {
          token.set(undefined);
          if (loggingIn.get()) {
            emit('loginfailure');
          } else {
            emit('loginstart');
            loggingIn.set(false);
          }
        } else {
          token.set(data.fulltoken);
          emit('logincomplete');
          loggingIn.set(false);
        }
      },
      error: function(data) {
        token.set(undefined);
        if (loggingIn.get()) {
          emit('loginfailure');
          loggingIn.set(false);
        } else {
          emit('loginstart');
        }
      }
    })
  };

  LoginModel.prototype.updateProfile = function() {
    var username, login;

    login = this;

    username = this.username;

    if (this.token.get() === undefined) {
      return;
    }

    $.get('https://api.tuvero.de/profile', 'auth=' + this.token.get(),
        function(profile) {
          if (profile) {
            if (profile.displayname) {
              username.set(profile.displayname);
            } else {

              username.set(undefined);
            }
          } else {
            username.set(undefined);
          }
        });
  };

  return LoginModel;
});
