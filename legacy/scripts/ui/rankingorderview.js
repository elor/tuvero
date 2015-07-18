/**
 * RankingOrderView
 *
 * @return RankingOrderView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './rankingcomponentview', './listview',
    './rankingordercontroller'], function(extend, TemplateView,
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
        $view.find('option.template'));

    this.$availableList = this.$view.find('>select').eq(0);
    this.$selectedList = this.$view.find('>select').eq(1);

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
    this.$availableList.find('option').each(function(index) {
      var $option = $(this);
      if (model.indexOf($option.val()) === -1) {
        $option.show();
      } else {
        $option.hide();
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
