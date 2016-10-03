/**
 * LoginController
 *
 * @return LoginController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller'], //
function(extend, Controller) {
  /**
   * Constructor
   */
  function LoginController(view) {
    LoginController.superconstructor.call(this, view);

    this.view.$view.find('.login').click(this.model.login.bind(this.model, true));
    this.view.$view.find('.loginwindow').click(this.view.openLoginWindow.bind(this.view));
    this.view.$view.find('.logoutwindow').click(this.view.openLogoutWindow.bind(this.view));
    this.view.$view.find('.logout').click(this.model.logout.bind(this.model));
  }
  extend(LoginController, Controller);

  return LoginController;
});
