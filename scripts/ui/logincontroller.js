/**
 * LoginController
 *
 * @return LoginController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
/**
 * Constructor
 */
function LoginController(view) {
  LoginController.superconstructor.call(this, view);
  this.view.$view.find('.login').click(this.model.createToken.bind(this.model));
  this.view.$view.find('.logout').click(this.model.invalidateToken.bind(this.model));
}
extend(LoginController, Controller);
export default LoginController;