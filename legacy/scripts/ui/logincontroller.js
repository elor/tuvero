/**
 * LoginController
 *
 * @return LoginController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'jquery'], function(extend,
    Controller, $) {
  /**
   * Constructor
   */
  function LoginController(view) {
    LoginController.superconstructor.call(this, view);

    this.view.$view.find('.login').click(this.openLoginWindow.bind(this));
    this.view.$view.find('.gettoken').click(this.getToken.bind(this));
    this.view.$view.find('.updateuser').click(this.getProfile.bind(this));
  }
  extend(LoginController, Controller);

  LoginController.prototype.openLoginWindow = function() {
    window.open('https://turniere.tuvero.de/login');
  }

  LoginController.prototype.getToken = function() {
    var token = this.model.token;

    $.get('https://turniere.tuvero.de/profile/token/new/json', function(tok) {
      if (tok) {
        if (tok.error) {
          token.set(tok.error);
        } else {
          token.set(tok.fulltoken);
        }
      } else {
        token.set('404');
      }
    })
  };

  LoginController.prototype.getProfile = function() {
    var username = this.model.username;

    $.get('https://api.tuvero.de/profile', 'auth=' + this.model.token.get(),
        function(profile) {
          if (profile) {
            if (profile.displayname) {
              username.set(profile.displayname);
            } else {
              username.set(profile.error);
            }
          } else {
            username.set('404');
          }
        });

  };

  return LoginController;
});
