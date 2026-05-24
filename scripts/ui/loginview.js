import View from '../core/view.js';
import ValueView from './valueview.js';
import LoginController from './logincontroller.js';
import $ from 'jquery';
import ValueModel from '../core/valuemodel.js';
import ClassView from '../core/classview.js';
import ImageView from './imageview.js';

/**
 * Constructor
 */
class LoginView extends View {
  constructor(model, $view) {
    super(model, $view);
    this.username = new ValueModel(undefined);
    this.avatar = new ValueModel(undefined);
    this.popupBlocked = new ValueModel(false);
    this.errorModel = new ValueModel(false);
    this.online = new ValueModel(this.model.communicationStatus().online);
    this.errorModel.registerListener(this.online);
    this.online.onupdate = function () {
      this.set(model.communicationStatus().online);
    };
    this.$userinfo = this.$view.find('.userinfo');
    this.$username = this.$view.find('.username');
    this.$avatar = this.$view.find('img.avatar');
    this.$loginbutton = this.$view.find('button.login');
    this.$logoutbutton = this.$view.find('button.logout');
    this.$busy = this.$view.find('.busy');
    this.$domainnotice = this.$view.find('.domainnotice');
    this.$nodomainnotice = this.$view.find('.nodomainnotice');
    this.$online = this.$view.find('.online');
    this.$offline = this.$view.find('.offline');
    this.userinfovisibility = new ClassView(this.model.tokenvalid, this.$userinfo, undefined, 'hidden');
    this.avatarvisibility = new ClassView(this.avatar, this.$avatar, undefined, 'hidden');
    this.usernamevisibility = new ClassView(this.username, this.$username, undefined, 'hidden');
    this.loginbuttonvisibility = new ClassView(this.model.tokenvalid, this.$loginbutton, 'hidden', undefined);
    this.logoutbuttonvisibility = new ClassView(this.model.tokenvalid, this.$logoutbutton, undefined, 'hidden');
    this.busyvisibility = new ClassView(this.model.openTransactions, this.$busy, undefined, 'hidden');
    this.onlineVisibility = new ClassView(this.online,
    //
    this.$online, undefined, 'hidden');
    this.offlineVisibility = new ClassView(this.online,
    //
    this.$offline, 'hidden');
    if (this.model.communicationStatus().tuvero) {
      this.$domainnotice.addClass('hidden');
    } else {
      this.$nodomainnotice.addClass('hidden');
    }
    this.usernameView = new ValueView(this.username, this.$username);
    this.avatarView = new ImageView(this.avatar, this.$avatar);
    this.loginWindow = undefined;
    this.loginPollingTimeout = undefined;
    this.loginWindowSuppressed = new ValueModel(false);
    this.popupBlockedView = new ClassView(this.popupBlocked, this.$view.find('.popupnotice'), undefined, 'hidden');
    this.errorView = new ClassView(this.errorModel, this.$view.find('.errornotice'), undefined, 'hidden');

    // TODO offlinenotice
    // TODO domainnotice

    $(window).on('beforeunload', function ($) {
      this.closeLoginWindow();
    }.bind(this));
    this.controller = new LoginController(this);
  }

  openLoginWindow() {
    this.closeLoginWindow();
    if (this.loginWindowSuppressed.get()) {
      this.loginWindowSuppressed.set(false);

      // loginWindow is supposed to be closed, but has been open while a token
      // creation is happening.
      // This indicates that the login window has been closed without logging
      // in.
      if (this.loginWindow) {
        this.onerror();
        this.loginWindow = undefined; // should be closed anyway
      }
      return false;
    }
    this.loginWindow = window.open('https://www.tuvero.de/login');
    if (!this.isLoginWindowOpen()) {
      this.closeLoginWindow();
      this.popupBlocked.set(true);
    } else {
      this.popupBlocked.set(false);
      this.loginWindowSuppressed.set(true);
    }
    return this.isLoginWindowOpen();
  }

  loginPolling() {
    if (this.loginPollingTimeout) {
      return;
    }
    this.loginPollingTimeout = window.setTimeout(function () {
      this.loginPollingTimeout = undefined;
      this.model.createToken();
    }.bind(this), 500);
  }

  closeLoginWindow() {
    console.log('closeLoginWindow');
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
    this.loginWindowSuppressed.set(false);
  }

  isLoginWindowOpen() {
    return !!this.loginWindow && !!this.loginWindow.parent;
  }

  updateProfile() {
    if (!this.model.communicationStatus().all) {
      this.username.set(undefined);
      this.avatar.set(undefined);
      return;
    }
    this.errorModel.set(false);
    const msg = this.model.message('/profile');
    msg.onreceive = function (emitter, event, data) {
      this.username.set(data.displayname);
      this.avatar.set(data.avatar_url);
    }.bind(this);
    msg.onerror = function () {
      this.errorModel.set(true);
      this.username.set(undefined);
      this.avatar.set(undefined);
    }.bind(this);
    msg.send();
  }

  onlogin() {
    this.errorModel.set(false);
    this.suppressLoginWindow = false;
    this.updateProfile();
    this.popupBlocked.set(false);
    this.closeLoginWindow();
  }

  onlogout() {
    this.errorModel.set(false);
    this.suppressLoginWindow = false;
    this.updateProfile();
  }

  onerror() {
    this.errorModel.set(true);
    this.suppressLoginWindow = false;
    this.updateProfile();
  }

  onauthenticate(emitter, event) {
    this.errorModel.set(false);
    if (!this.isLoginWindowOpen()) {
      if (!this.openLoginWindow()) {
        return;
      }
    }
    this.loginPolling();
  }
}

export default LoginView;