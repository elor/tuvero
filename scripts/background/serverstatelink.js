define(['jquery', 'ui/state', 'core/classview'], function ($, State, ClassView) {
  var ServerStateLink = {};

  $(function ($) {
    ServerStateLink.classView = new ClassView(State.serverlink, $('body'), 'statelink', 'nostatelink');
  });

  return ServerStateLink;
});
