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
    this.closeLoginWindow();

    this.loginWindow = window.open('https://turniere.tuvero.de/login');
  };

  LoginView.prototype.loginPolling = function() {
    var timeout;

    if (this.interval) {
      return;
    }

    timeout = this.interval = window.setTimeout((function() {
      if (this.interval !== timeout) {
        return;
      }
      this.interval = undefined;

      this.model.login(false);
    }).bind(this), 500);
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
      this.timeout = undefined;
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

  LoginView.prototype.onloginstart = function(emitter, event, causedByUser) {
    if (causedByUser) {
      this.openLoginWindow();
    }
    this.loginPolling();
  };

  return LoginView;
});
