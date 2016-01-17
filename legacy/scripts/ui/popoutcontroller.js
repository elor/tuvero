/**
 * PopoutController
 *
 * @return PopoutController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'ui/toast', 'ui/strings',
    'core/classview', 'ui/state_new'], function(extend, Controller, Toast,
    Strings, ClassView, State) {
  var mainPopout;

  mainPopout = undefined;

  function isMainPopoutOpen() {
    return mainPopout && mainPopout.document;
  }

  /**
   * close all popout on page leave
   */
  $(function($) {
    $(window).on('beforeunload', function() {
      if (isMainPopoutOpen()) {
        mainPopout.close();
      }
    });
  });

  /**
   * Constructor
   */
  function PopoutController(view, cloneFunction) {
    PopoutController.superconstructor.call(this, view);

    this.cloneFunction = cloneFunction;

    if (this.view.$popout) {
      this.view.$popout.click(this.popout.bind(this));
    }
    if (this.view.$close) {
      this.view.$close.click(this.close.bind(this));
    }
  }
  extend(PopoutController, Controller);

  PopoutController.prototype.popout = function(e) {
    var $popoutView, stylepath, $stylelink, $title, $body;

    $popoutView = this.view.$popoutTemplate.clone();

    if (!isMainPopoutOpen()) {
      console.log('opening new popout');
      mainPopout = window.open('', '', 'location=0');
      stylepath = window.location.href.replace(/index.html[?#].*/,
          'style/main.css');
      $stylelink = $('<link rel="stylesheet" href=' + stylepath + '>');
      $title = $('title').clone();
      $(mainPopout.document.head).append($stylelink).append($title);
      $body = $(mainPopout.document.body);
      $body.attr('id', 'app').addClass('popoutContainer');
      $body.data({
        maxWidthView: new ClassView(State.tabOptions.nameMaxWidth, $body,
            'maxwidth', 'nomaxwidth'),
        hideNamesView: new ClassView(State.tabOptions.showNames, $body,
            undefined, 'hidenames'),
        showtableClassView: new ClassView(State.tabOptions.showMatchTables,
            $body, 'showmatchtable', 'showtable')
      });

    } else {
      console.log('main popout already exists and is open');
    }

    $popoutView.addClass('primaryPopout');
    $(mainPopout.document.body).append($popoutView);
    this.cloneFunction.call(mainPopout, $popoutView);

    window.setTimeout(function() {
      if (!isMainPopoutOpen()) {
        new Toast(Strings.popout_adblocked);
      }
    }, 500);

    e.preventDefault(true);
    return false;
  };

  PopoutController.prototype.close = function(e) {
    console.log('close');

    this.view.destroy();

    e.preventDefault(true);
    return false;
  };

  // TODO close a popout when its parent is removed from the DOM

  // TODO close a popout when it's forcefully reloaded

  // TODO add close buttons to the popouts

  // TODO close a window when its last popout is closed

  // TODO allow popouts to be moved to their own window

  // TODO change CSS behavior of tables to not rely on proper tabs!

  // TODO call destroy() when the popout is closed.

  return PopoutController;
});
