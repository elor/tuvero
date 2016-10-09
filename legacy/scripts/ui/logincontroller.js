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

    this.view.$view.find('.login').click(
        this.model.createToken.bind(this.model));
    this.view.$view.find('.logout').click(
        this.model.invalidateToken.bind(this.model));
  }
  extend(LoginController, Controller);

  return LoginController;
});
