/**
 * register and initiate static views, which aren't necessarily subviewed
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['../boxview', '../staticviewloader', 'jquery'], function(BoxView,
    StaticViewLoader, $) {
  var InitViews = undefined;

  $(function($) {
    StaticViewLoader.registerView('boxview', BoxView);
    StaticViewLoader.loadViews($('body'));
  });

  return InitViews;
});
