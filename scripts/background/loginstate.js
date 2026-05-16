import $ from 'jquery';
import Server from '../ui/server.js';
import ClassView from '../core/classview.js';
var LoginState = {};
$(function ($) {
  LoginState.classView = new ClassView(Server.logged_in, $('body'), 'loggedin', 'loggedout');
});
export default LoginState;