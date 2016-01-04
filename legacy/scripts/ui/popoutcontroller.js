/**
 * PopoutController
 *
 * @return PopoutController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller'], function(extend, Controller) {
  var openWindows;

  windows = [];

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
    var container, $popoutView, stylepath, $stylelink, $title;

    $popoutView = this.view.$popoutTemplate.clone();

    console.log('opening popout');
    container = window.open(undefined, 'popout');
    // container = window.open(undefined, 'popout' + windows.length);

    if (!container) {
      console.error(Error('cannot open popout window'));
      throw new Error('cannot open popout window');
    }

    stylepath = window.location.href.replace(/index.html[?#].*/,
        'style/main.css');
    $stylelink = $('<link rel="stylesheet" href=' + stylepath + '>');
    $title = $('title').clone();
    $(container.document.head).append($stylelink).append($title);
    $(container.document.body).attr('id', 'app').append($popoutView);
    this.cloneFunction.call(container, $popoutView);

    window.setTimeout(function() {
      if (!container || !container.document || !container.document.body) {
        new Toast(Strings.popout_adblocked);
      }
    }, 500);

    windows.push(container);

    e.preventDefault(true);
    return false;
  };

  // TODO close all popout on page leave

  // TODO close a popout when its parent is removed from the DOM

  // TODO close a popout when it's forcefully reloaded

  // TODO add close buttons to the popouts

  // TODO close a window when its last popout is closed

  // TODO allow popouts to be moved to their own window

  // TODO change CSS behavior of tables to not rely on proper tabs!

  return PopoutController;
});
