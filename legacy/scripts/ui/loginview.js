/**
 * LoginView
 *
 * @return LoginView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/valueview', 'ui/logincontroller',
    'core/classview', 'jquery'], function(extend, View, ValueView,
    LoginController, ClassView, $) {
  /**
   * Constructor
   */
  function LoginView(model, $view) {
    LoginView.superconstructor.call(this, model, $view);

    this.usernameView = new ValueView(this.model.username, this.$view
        .find('.username'));

    this.loginWindow = undefined;
    this.interval = undefined;
    this.loginWindowJustClosed = false;

    this.usernameView = new ValueView(this.model.username, this.$view
        .find('.username'));

    this.controller = new LoginController(this);
  }
  extend(LoginView, View);

  LoginView.prototype.openLogoutWindow = function() {
    window.open('https://turniere.tuvero.de/logout');
  };

  LoginView.prototype.openLoginWindow = function() {
    if (this.isLoginWindowOpen() && this.loginWindow.focus) {
      $(this.loginWindow).focus();
      return;
    } else {
      this.closeLoginWindow();
    }

    this.loginWindow = window.open('https://turniere.tuvero.de/login');

    this.interval = window.setInterval((function() {
      if (!this.loginWindow.parent) {
        window.clearInterval(this.interval);
        this.interval = undefined;
        this.loginWindowJustClosed = true;
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
    return !!this.loginWindow && !!this.loginWindow.parent;
  };

  LoginView.prototype.onloginsuccess = function() {
    this.loginWindowJustClosed = false;
    this.closeLoginWindow();
  };

  LoginView.prototype.onloginfailure = function() {
    this.loginWindowJustClosed = false;
  };

  LoginView.prototype.onloginstart = function() {
    if (this.loginWindowJustClosed) {
      this.loginWindowJustClosed = false;
    } else {
      this.openLoginWindow();
    }
  };

  return LoginView;
});
