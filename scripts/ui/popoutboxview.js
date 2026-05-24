/**
 * PopoutBoxView
 *
 * @return PopoutBoxView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import BoxView from './boxview.js';
import PopoutController from './popoutcontroller.js';
import ValueModel from '../core/valuemodel.js';
import ClassView from '../core/classview.js';
let $iconTemplate,
    $popoutIconTemplate,
    $closeIconTemplate,
    //
    $pageBreakIconTemplate;
$iconTemplate = $('<div>').addClass('icon').addClass('noprint');

// TODO read this from DOM.
$popoutIconTemplate = $iconTemplate.clone().addClass('popout').text('↗');
$closeIconTemplate = $iconTemplate.clone().addClass('close').text('x');
$pageBreakIconTemplate = $iconTemplate.clone().addClass('pagebreak').text('⏎');

/**
 * Constructor
 */
class PopoutBoxView extends BoxView {
  constructor($view, $popoutTemplate, cloneFunction) {
    super($view);
    this.$popoutTemplate = $popoutTemplate;
    if (this.$view.hasClass('primaryPopout')) {
      this.addCloseIcon();
      this.addPageBreakIcon();
    } else {
      this.addPopoutIcon();
    }
    this.popoutController = new PopoutController(this, cloneFunction);
  }

  addPopoutIcon() {
    this.$popout = $popoutIconTemplate.clone();
    this.$view.find('>h3:first-child').append(this.$popout);
  }

  addCloseIcon() {
    this.$close = $closeIconTemplate.clone();
    this.$view.find('>h3:first-child').append(this.$close);
  }

  addPageBreakIcon() {
    this.$pageBreak = $pageBreakIconTemplate.clone();
    this.pageBreakModel = new ValueModel(false);
    this.pageBreakView = new ClassView(this.pageBreakModel, this.$view, 'pagebreak');
    this.$view.find('>h3:first-child').append(this.$pageBreak);
  }

  destroy() {
    if (this.pageBreakModel) {
      this.pageBreakModel.destroy();
    }
    if (this.pageBreakView) {
      this.pageBreakView.destroy();
    }
    super.destroy();
  }
}

export default PopoutBoxView;