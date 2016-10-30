/**
 * LoginView
 *
 * @return LoginView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/valueview', 'ui/logincontroller',
    'jquery', 'core/valuemodel', 'core/classview', 'ui/imageview'], function(
    extend, View, ValueView, LoginController, $, ValueModel, ClassView,
    ImageView) {
  /**
   * Constructor
   */
  function LoginView(model, $view) {
    LoginView.superconstructor.call(this, model, $view);

    this.username = new ValueModel(undefined);
    this.avatar = new ValueModel(undefined);
    this.popupBlocked = new ValueModel(false);

    this.$userinfo = this.$view.find('.userinfo');
    this.$username = this.$view.find('.username');
    this.$avatar = this.$view.find('img.avatar');
    this.$loginbutton = this.$view.find('button.login');
    this.$logoutbutton = this.$view.find('button.logout');

    this.userinfovisibility = new ClassView(this.model.tokenvalid,
        this.$userinfo, undefined, 'hidden');
    this.loginbuttonvisibility = new ClassView(this.model.tokenvalid,
        this.$loginbutton, 'hidden', undefined);
    this.logoutbuttonvisibility = new ClassView(this.model.tokenvalid,
        this.$logoutbutton, undefined, 'hidden');

    this.usernameView = new ValueView(this.username, this.$username);

    this.avatarView = new ImageView(this.avatar, this.$avatar);

    this.loginWindow = undefined;
    this.loginPollingTimeout = undefined;

    this.popupBlockedView = new ClassView(this.popupBlocked, this.$view
        .find('.popupnotice'), undefined, 'hidden');

    this.errorModel = new ValueModel(false);
    this.errorModel.onupdate = function(state) {
      this.set(state.get() === 'error');
    };
    this.errorView = new ClassView(this.errorModel, this.$view
        .find('.errornotice'), undefined, 'hidden');

    // TODO offlinenotice
    // TODO domainnotice

    $(window).on('beforeunload', (function($) {
      this.closeLoginWindow();
    }).bind(this));

    this.controller = new LoginController(this);
  }
  extend(LoginView, View);

  LoginView.prototype.openLoginWindow = function() {
    this.closeLoginWindow();

    this.loginWindow = window.open('https://turniere.tuvero.de/login');

    if (!this.isLoginWindowOpen()) {
      this.closeLoginWindow();
      this.popupBlocked.set(true);
    } else {
      this.popupBlocked.set(false);
    }

    return this.isLoginWindowOpen();
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

      this.model.createToken();
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

  LoginView.prototype.isLoginWindowOpen = function() {
    return !!this.loginWindow && !!this.loginWindow.parent;
  };

  LoginView.prototype.updateProfile = function() {
    if (!this.model.communicationStatus().all) {
      this.username.set(undefined);
      return;
    }

    var msg = this.model.message('/profile');
    msg.onreceive = (function(emitter, event, data) {
      this.username.set(data.displayname);
      this.avatar.set(data.avatar_url);
    }).bind(this);
    msg.onerror = (function() {
      this.username.set(undefined);
      this.avatar.set(undefined);
    }).bind(this);
    msg.send();
  };

  LoginView.prototype.onlogin = function() {
    this.updateProfile();
    this.popupBlocked.set(false);
    this.closeLoginWindow();
  };

  LoginView.prototype.onlogout = function() {
    this.updateProfile();
  };

  LoginView.prototype.onerror = function() {
    this.updateProfile();
  };

  LoginView.prototype.onauthenticate = function(emitter, event) {
    if (!this.isLoginWindowOpen()) {
      if (!this.openLoginWindow()) {
        return;
      }
    }

    this.loginPolling();
  };

  return LoginView;
});
