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
    this.logoutWindow = undefined;
    this.loginPollingTimeout = undefined;
    this.loginPollingTimeout = undefined;

    this.usernameView = new ValueView(this.model.username, this.$view
        .find('.username'));

    this.controller = new LoginController(this);
  }
  extend(LoginView, View);

  LoginView.prototype.openLogoutWindow = function() {
    this.closeLogoutWindow();

    this.logoutWindow = window.open('https://turniere.tuvero.de/logout');

    this.logoutPolling();
  };

  LoginView.prototype.openLoginWindow = function() {
    this.closeLoginWindow();

    this.loginWindow = window.open('https://turniere.tuvero.de/login');
  };

  LoginView.prototype.loginPolling = function() {
    var timeout;

    if (this.loginPollingTimeout) {
      return;
    }

    timeout = this.loginPollingTimeout = window.setTimeout((function() {
      if (this.loginPollingTimeout !== timeout) {
        return;
      }
      this.loginPollingTimeout = undefined;

      this.model.login(false);
    }).bind(this), 500);
  };

  LoginView.prototype.logoutPolling = function() {
    var timeout;

    if (this.logoutPollingTimeout) {
      return;
    }

    timeout = this.logoutPollingTimeout = window.setTimeout((function() {
      if (this.logoutPollingTimeout !== timeout) {
        return;
      }
      this.logoutPollingTimeout = undefined;

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

    if (this.loginPollingTimeout !== undefined) {
      window.clearInterval(this.loginPollingTimeout);
      this.loginPollingInterval = undefined;
    }

    this.loginWindow = undefined;
  };

  LoginView.prototype.closeLogoutWindow = function() {
    if (!this.isLogoutWindowOpen()) {
      return;
    }

    if (this.logoutWindow) {
      this.logoutWindow.close();
    }

    if (this.logoutPollingTimeout !== undefined) {
      window.clearInterval(this.logoutPollingTimeout);
      this.logoutPollingInterval = undefined;
    }

    this.logoutWindow = undefined;
  };

  LoginView.prototype.isLoginWindowOpen = function() {
    return !!this.loginWindow && !!this.loginWindow.parent;
  };

  LoginView.prototype.isLogoutWindowOpen = function() {
    return !!this.logoutWindow && !!this.logoutWindow.parent;
  };

  LoginView.prototype.onlogincomplete = function() {
    this.closeLoginWindow();

    if (this.isLogoutWindowOpen()) {
      this.logoutPolling();
    }
  };

  LoginView.prototype.onloginfailure = function() {
    this.closeLogoutWindow();
  };

  LoginView.prototype.onloginstart = function(emitter, event, causedByUser) {
    this.closeLogoutWindow();

    if (causedByUser) {
      this.openLoginWindow();
    }
    this.loginPolling();
  };

  return LoginView;
});
