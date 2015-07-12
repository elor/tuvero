/**
 * SystemListView
 *
 * @return SystemListView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listview', './teamview', './teamtableview',
    'core/orderlistmodel', 'core/listener'], function(extend, ListView,
    TeamView, TeamTableView, OrderListModel, Listener) {
  /**
   * Constructor
   *
   * @param tournaments
   * @param $view
   * @param teams
   * @param teamsize
   */
  function SystemListView(teams, $view, tournaments, teamsize) {
    var view, $systemTemplate, orderList;
    $systemTemplate = $view.find('.system.tpl').detach();
    orderList = new OrderListModel();
    SystemListView.superconstructor.call(this, orderList, $view, $view
        .find('.team.tpl'), TeamView.bindTeamList(teams));

    orderList.enforceOrder(tournaments.getGlobalRanking(teams).displayOrder);

    Listener.bind(tournaments, 'update', function() {
      orderList.enforceOrder(tournaments.getGlobalRanking(teams).displayOrder);
    });

    Listener.bind(teams, 'insert', function() {
      orderList.enforceOrder(tournaments.getGlobalRanking(teams).displayOrder);
    });

    Listener.bind(teams, 'remove', function() {
      orderList.enforceOrder(tournaments.getGlobalRanking(teams).displayOrder);
    });

    view = new TeamTableView(this, teamsize);
  }
  extend(SystemListView, ListView);

  return SystemListView;
});
