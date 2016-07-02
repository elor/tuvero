/**
 * PopoutBoxView
 *
 * @return PopoutBoxView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', './boxview', './popoutcontroller', 'core/valuemodel',
    'core/classview'], function($, extend, BoxView, PopoutController, ValueModel,
    ClassView) {
  var $iconTemplate, $popoutIconTemplate, $closeIconTemplate, //
  $pageBreakIconTemplate;

  $iconTemplate = $('<div>').addClass('icon').addClass('noprint');

  // TODO read this from DOM.
  $popoutIconTemplate = $iconTemplate.clone().addClass('popout').text('↗');
  $closeIconTemplate = $iconTemplate.clone().addClass('close').text('x');
  $pageBreakIconTemplate = $iconTemplate.clone().addClass('pagebreak')
      .text('⏎');

  /**
   * Constructor
   */
  function PopoutBoxView($view, $popoutTemplate, cloneFunction) {
    PopoutBoxView.superconstructor.call(this, $view);

    this.$popoutTemplate = $popoutTemplate;

    if (this.$view.hasClass('primaryPopout')) {
      this.addCloseIcon();
      this.addPageBreakIcon();
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

  PopoutBoxView.prototype.addPageBreakIcon = function() {
    this.$pageBreak = $pageBreakIconTemplate.clone();
    this.pageBreakModel = new ValueModel(false);
    this.pageBreakView = new ClassView(this.pageBreakModel, this.$view,
        'pagebreak');
    this.$view.find('>h3:first-child').append(this.$pageBreak);
  };

  PopoutBoxView.prototype.destroy = function() {
    if (this.pageBreakModel) {
      this.pageBreakModel.destroy();
    }
    if (this.pageBreakView) {
      this.pageBreakView.destroy();
    }

    PopoutBoxView.superclass.destroy.bind(this);
  };

  return PopoutBoxView;
});
