/**
 * LoginView
 *
 * @return LoginView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'core/valuemodel', 'ui/valueview',
    'ui/logincontroller'], function(extend, View, ValueModel, ValueView,
    LoginController) {
  /**
   * Constructor
   */
  function LoginView($view) {
    LoginView.superconstructor.call(this, undefined, $view);

    this.model.username = new ValueModel('(unknown)');
    this.model.token = new ValueModel('(unknown)');

    this.usernameView = new ValueView(this.model.username, this.$view
        .find('.username'));
    this.tokenView = new ValueView(this.model.token, this.$view.find('.token'));

    this.controller = new LoginController(this);
  }
  extend(LoginView, View);

  return LoginView;
});
