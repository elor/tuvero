/**
 * LoginView
 *
 * @return LoginView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/loginmodel', 'ui/valueview',
    'ui/logincontroller', 'core/classview'], function(extend, View, LoginModel,
    ValueView, LoginController, ClassView) {
  /**
   * Constructor
   */
  function LoginView(model, $view) {
    LoginView.superconstructor.call(this, model, $view);

    this.usernameView = new ValueView(this.model.username, this.$view
        .find('.username'));

    this.loginWindow = undefined;

    this.controller = new LoginController(this);
  }
  extend(LoginView, View);

  LoginView.prototype.openLoginWindow = function() {
    this.closeLoginWindow();

    this.loginWindow = window.open('https://turniere.tuvero.de/login');
  };

  LoginView.prototype.closeLoginWindow = function() {
    if (!this.isloginWindowOpen()) {
      return;
    }

    if (this.loginWindow) {
      this.loginWindow.close();
    }
    this.loginWindow = undefined;
  };

  LoginView.prototype.isLoginWindowOpen = function() {
    return !!this.loginWindow && !!this.loginWindow.document;
  };

  LoginView.prototype.onloginstart = function() {
    if (!this.isLoginWindowOpen()) {
      this.openLoginWindow();
    }
  };

  LoginView.prototype.onloginsuccess = function() {
    this.closeLoginWindow();
  };

  return LoginView;
});
