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
  var $iconTemplate;

  // TODO read this from DOM.
  $iconTemplate = $('<div>').addClass('popout').text("↗");

  /**
   * Constructor
   */
  function PopoutBoxView($view, $popoutTemplate, cloneFunction) {
    PopoutBoxView.superconstructor.call(this, $view);

    this.$popoutTemplate = $popoutTemplate;
    this.$popout = $iconTemplate.clone();
    this.$view.find('>h3:first-child').append(this.$popout);

    this.popoutController = new PopoutController(this, cloneFunction);
  }
  extend(PopoutBoxView, BoxView);

  return PopoutBoxView;
});
