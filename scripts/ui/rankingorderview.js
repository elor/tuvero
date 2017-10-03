/**
 * RankingOrderView
 *
 * @return RankingOrderView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'ui/templateview', 'ui/rankingcomponentview', 'ui/listview',
    'ui/rankingordercontroller'], function($, extend, TemplateView,
    RankingComponentView, ListView, RankingOrderController) {
  /**
   * Constructor
   *
   * @param selectedComponents
   * @param $view
   * @param allComponents
   */
  function RankingOrderView(selectedComponents, $view, allComponents) {
    RankingOrderView.superconstructor.call(this, selectedComponents, $view,
        $view.find('.template'));

    this.selected = selectedComponents;
    this.allComponents = allComponents;

    this.$availableList = this.$view.find('.available');
    this.$selectedList = this.$view.find('.selected');

    this.selectedListView = new ListView(selectedComponents,
        this.$selectedList, this.$template, RankingComponentView);
    this.availableListView = new ListView(allComponents, this.$availableList,
        this.$template, RankingComponentView);

    this.controller = new RankingOrderController(this);

    this.update();
  }
  extend(RankingOrderView, TemplateView);

  /**
   * automatically show/hide already selected values from the list of available
   * items
   */
  RankingOrderView.prototype.update = function() {
    var model = this.model;
    this.$availableList.find('.component').each(function(index) {
      var $option = $(this);
      if (model.indexOf($option.val()) === -1) {
        $option.removeClass('hidden');
      } else {
        $option.addClass('hidden');
      }
    });
  };

  /**
   * an item has been inserted into the left list. Update the right list.
   */
  RankingOrderView.prototype.oninsert = function() {
    this.update();
  };

  /**
   * an item has been removed from the left list. Update the right list.
   */
  RankingOrderView.prototype.onremove = function() {
    this.update();
  };

  return RankingOrderView;
});
