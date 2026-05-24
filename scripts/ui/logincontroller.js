import Controller from '../core/controller.js';

/**
 * Constructor
 */
class LoginController extends Controller {
  constructor(view) {
    super(view);
    this.view.$view.find('.login').click(this.model.createToken.bind(this.model));
    this.view.$view.find('.logout').click(this.model.invalidateToken.bind(this.model));
  }
}

export default LoginController;