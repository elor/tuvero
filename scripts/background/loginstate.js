define(['jquery', 'ui/server', 'core/classview'], function ($, Server, ClassView) {
    var LoginState = {};

    $(function ($) {
      LoginState.classView = new ClassView(Server.logged_in, $('body'), 'loggedin', 'loggedout');
    });

    return LoginState;
  });
