/**
 * create BoxViews for every div.boxview
 * 
 * TODO remove this file in favor of subviewed boxes
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ '../boxview', '../staticviewloader' ], function (BoxView, StaticViewLoader) {
  $(function ($) {

    StaticViewLoader.registerView('boxview', BoxView);

    StaticViewLoader.loadViews($('body'));
  });
});
