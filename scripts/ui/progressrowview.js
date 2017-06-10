/**
 * ProgressRowView
 *
 * @return ProgressRowView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/templateview', 'ui/teamview', 'ui/listview', //
'list/listmodel', 'ui/inlinelistview', 'core/listener', 'ui/matchresultview'], //
function(extend, TemplateView, TeamView, ListView, ListModel, InlineListView,
    Listener, MatchResultView) {
  /**
   * Constructor
   */
  function ProgressRowView(matches, $view, teamlist, tournament) {
    var teamno = matches.get(0).getTeamID(0);
    ProgressRowView.superconstructor.call(this, teamlist.get(teamno), $view,
        $view.find('.template'));

    this.ranking = tournament.getRanking();
    this.$separator = this.$view.find('.hidden.separator');
    this.rankingList = new ListModel();

    this.teamView = new TeamView(this.model, $view);

    // TODO defer
    this.updatePending = false;
    Listener.bind(this.ranking, 'update', function() {
      if (!this.updatePending) {
        window.setTimeout(this.updateRank.bind(this), 1);
        this.updatePending = true;
      }
    }, this);

    this.matches = new InlineListView(matches, this.$separator, this.$template
        .filter('.match'), MatchResultView, teamlist, tournament);

    this.ranks = new ListView(this.rankingList, this.$view, this.$template
        .filter('.rankingcomponent'));

    this.updateRank();
  }
  extend(ProgressRowView, TemplateView);

  ProgressRowView.prototype.updateRank = function() {
    var ranking, rankIndex, order;

    ranking = this.ranking.get();
    rankIndex = ranking.ids.indexOf(this.model.getID());

    order = ranking.components.slice(0);
    order.push('ranks');

    order.forEach(function(component, index) {
      var value = ranking[component][rankIndex];
      if (component === 'ranks') {
        value += 1;
      }

      if (this.rankingList.length === index) {
        this.rankingList.push(value);
      } else if (this.rankingList.get(index) !== value) {
        this.rankingList.set(index, value);
      }
    }, this);

    this.updatePending = false;
  };

  return ProgressRowView;
});
