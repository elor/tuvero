/**
 * RankingOrderView
 *
 * @return RankingOrderView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './rankingcomponentview', //
'./listview'], function(extend, TemplateView, RankingComponentView, ListView) {
  /**
   * Constructor
   *
   * @param selectedComponents
   * @param $view
   * @param allComponents
   */
  function RankingOrderView(selectedComponents, $view, allComponents) {
    var $selectedList, $availableList;

    RankingOrderView.superconstructor.call(this, selectedComponents, $view,
        $view.find('option'));

    $selectedList = this.$view.find('>select').eq(0);
    $availableList = this.$view.find('>select').eq(1);

    this.selectedListView = new ListView(selectedComponents, $selectedList,
        this.$template, RankingComponentView);
    this.availableListView = new ListView(allComponents, $availableList,
        this.$template, RankingComponentView);
  }
  extend(RankingOrderView, TemplateView);

  return RankingOrderView;
});
