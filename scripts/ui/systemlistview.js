/**
 * SystemListView
 *
 * @return SystemListView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/listview', 'ui/teamtableview', 'list/orderlistmodel',
    'core/listener', 'ui/systemtablerowview'], function(extend, ListView,
    TeamTableView, OrderListModel, Listener, SystemTableRowView) {
  /**
   * Constructor
   *
   * @param teams
   *          a ListModel of TeamModels
   * @param $view
   *          the associated DOM subtree
   * @param tournaments
   *          a ListModel of TournamentModels
   * @param teamsize
   *          a ValueModel which stores the team size
   * @param tournamentViewFactory
   *          a TournamentView factory
   *
   */
  function SystemListView(teams, $view, tournaments, teamsize,
      tournamentViewFactory) {
    var orderList, updateTimeout, view;

    orderList = new OrderListModel();
    SystemListView.superconstructor.call(this, orderList, $view, $view
        .find('.team.template'), SystemTableRowView, teams, tournaments,
        tournamentViewFactory);

    this.teams = teams;
    this.tournaments = tournaments;

    updateTimeout = undefined;

    Listener.bind(tournaments, 'update', function(model, event, data) {
      var list = this;
      if (updateTimeout === undefined) {
        window.setTimeout(function() {
          list.updateOrder();
          updateTimeout = undefined;
        }, 1);
      }
    }, this);

    Listener.bind(teams, 'insert,remove', function(model, event, data) {
      var list = this;
      if (event === 'remove') {
        list.removeAfter(data.id);
      }

      if (updateTimeout === undefined) {
        window.setTimeout(function() {
          list.updateOrder();
          updateTimeout = undefined;
        }, 1);
      }
    }, this);

    this.updateOrder();

    view = new TeamTableView(this, teamsize);
  }
  extend(SystemListView, ListView);

  /**
   * Update the row order to match the global ranking displayOrder
   */
  SystemListView.prototype.updateOrder = function() {
    var ranking, order;

  if (this.teams.length > 0) {
    ranking = this.tournaments.getGlobalRanking(this.teams.length);
    order = ranking.displayOrder;
    this.model.enforceOrder(order);
  }
  };

  /**
   * remove all teams with an ID after and including firstID, regardless of the
   * display order
   *
   * @param firstID
   *          the first ID to remove
   */
  SystemListView.prototype.removeAfter = function(firstID) {
    var order = this.model.map(function(teamID) {
      return teamID;
    }).filter(function(id) {
      return id < firstID;
    });

    this.model.enforceOrder(order);
  };

  return SystemListView;
});
