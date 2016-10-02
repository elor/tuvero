/**
 * LoginView
 *
 * @return LoginView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/valueview', 'ui/logincontroller',
    'core/classview'], function(extend, View, ValueView, LoginController,
    ClassView) {
  /**
   * Constructor
   */
  function LoginView(model, $view) {
    LoginView.superconstructor.call(this, model, $view);

    this.usernameView = new ValueView(this.model.username, this.$view
        .find('.username'));

    this.loginWindow = undefined;
    this.interval = undefined;

    this.tokenView = new ValueView(this.model.token, //
    this.$view.find('.token'));
    this.tokenView = new ValueView(this.model.state, //
    this.$view.find('.state'));
    this.usernameView = new ValueView(this.model.username, //
    this.$view.find('.username'));

    this.model.registerListener(this);

    this.controller = new LoginController(this);
  }
  extend(LoginView, View);

  LoginView.prototype.openLogoutWindow = function() {
    window.open('https://turniere.tuvero.de/logout');
  };

  LoginView.prototype.openLoginWindow = function() {
    this.closeLoginWindow();

    this.loginWindow = window.open('https://turniere.tuvero.de/login');

    this.interval = window.setInterval((function() {
      if (!this.loginWindow.parent) {
        window.clearInterval(this.interval);
        this.model.login();
      }
    }).bind(this), 100);
  };

  LoginView.prototype.closeLoginWindow = function() {
    if (!this.isLoginWindowOpen()) {
      return;
    }

    if (this.loginWindow) {
      this.loginWindow.close();
    }

    if (this.interval !== undefined) {
      window.clearInterval(this.interval);
      this.interval = undefined;
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

  LoginView.prototype.onloginrequired = function() {
    this.openLoginWindow();
  };

  return LoginView;
});
