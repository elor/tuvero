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
        $view.find('option'));

    this.$selectedList = this.$view.find('>select').eq(0);
    this.$availableList = this.$view.find('>select').eq(1);

    this.selectedListView = new ListView(selectedComponents,
        this.$selectedList, this.$template, RankingComponentView);
    this.availableListView = new ListView(allComponents, this.$availableList,
        this.$template, RankingComponentView);

    this.controller = new RankingOrderController(this);
  }
  extend(RankingOrderView, TemplateView);

  return RankingOrderView;
});
