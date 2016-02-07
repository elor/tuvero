/**
 * PopoutBoxView
 *
 * @return PopoutBoxView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './boxview', './popoutcontroller'], function(extend,
    BoxView, PopoutController) {
  var $popoutIconTemplate, $closeIconTemplate;

  // TODO read this from DOM.
  $popoutIconTemplate = $('<div>').addClass('popout').text('↗');
  $closeIconTemplate = $('<div>').addClass('close').addClass('noprint').text(
      '❌');

  /**
   * Constructor
   */
  function PopoutBoxView($view, $popoutTemplate, cloneFunction) {
    PopoutBoxView.superconstructor.call(this, $view);

    this.$popoutTemplate = $popoutTemplate;

    if (this.$view.hasClass('primaryPopout')) {
      this.addCloseIcon();
    } else {
      this.addPopoutIcon();
    }

    this.popoutController = new PopoutController(this, cloneFunction);
  }
  extend(PopoutBoxView, BoxView);

  PopoutBoxView.prototype.addPopoutIcon = function() {
    this.$popout = $popoutIconTemplate.clone();
    this.$view.find('>h3:first-child').append(this.$popout);
  };

  PopoutBoxView.prototype.addCloseIcon = function() {
    this.$close = $closeIconTemplate.clone();
    this.$view.find('>h3:first-child').append(this.$close);
  };

  return PopoutBoxView;
});
