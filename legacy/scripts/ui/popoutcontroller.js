/**
 * PopoutController
 *
 * @return PopoutController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'ui/toast', 'ui/strings'], function(
    extend, Controller, Toast, Strings) {
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
      debugger
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

    this.view.$popout.click(this.popout.bind(this));
  }
  extend(PopoutController, Controller);

  PopoutController.prototype.popout = function(e) {
    var $popoutView, stylepath, $stylelink, $title;

    $popoutView = this.view.$popoutTemplate.clone();

    if (!isMainPopoutOpen()) {
      console.log('opening new popout');
      mainPopout = window.open('', '', 'location=0');
    } else {
      console.log('main popout already exists and is open');
    }

    stylepath = window.location.href.replace(/index.html[?#].*/,
        'style/main.css');
    $stylelink = $('<link rel="stylesheet" href=' + stylepath + '>');
    $title = $('title').clone();
    $(mainPopout.document.head).append($stylelink).append($title);
    $(mainPopout.document.body).attr('id', 'app').append($popoutView);
    this.cloneFunction.call(mainPopout, $popoutView);

    window.setTimeout(function() {
      if (!isMainPopoutOpen()) {
        new Toast(Strings.popout_adblocked);
      }
    }, 500);

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
