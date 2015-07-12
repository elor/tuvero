/**
 * SystemListView
 *
 * @return SystemListView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listview', './teamtableview', 'core/orderlistmodel',
    'core/listener', './systemtablerowview'], function(extend, ListView,
    TeamTableView, OrderListModel, Listener, SystemTableRowView) {
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
        .find('.team.tpl'), SystemTableRowView.bindLists(teams, tournaments));

    this.teams = teams;
    this.tournaments = tournaments;

    Listener.bind(tournaments, 'update', function() {
      this.updateOrder();
    }, this);

    Listener.bind(teams, 'insert,remove', function() {
      this.updateOrder();
    }, this);

    this.updateOrder();

    view = new TeamTableView(this, teamsize);
  }
  extend(SystemListView, ListView);

  SystemListView.prototype.updateOrder = function() {
    var order = this.tournaments.getGlobalRanking(this.teams).displayOrder;
    this.model.enforceOrder(order);
  };

  return SystemListView;
});
