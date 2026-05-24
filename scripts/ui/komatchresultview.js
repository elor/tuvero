import MatchResultView from './matchresultview.js';
import KOTreePosition from './kotreeposition.js';

/**
 * Constructor
 *
 * @param model
 *          a MatchResult instance
 * @param $view
 *          the container element
 * @param teamlist
 *          a ListModel of TeamModel instances
 * @param tournament
 *          a TournamentModel instance
 * @param fullwidth {ValueModel}
 *          whether a name is shown
 * @returns {undefined}
 */
class KOMatchResultView extends MatchResultView {
  constructor(model, $view, teamlist, tournament, fullwidth) {
    super(model, $view, teamlist, tournament);
    this.tournament = tournament;
    this.fullwidth = fullwidth;
    this.reposition();
    fullwidth.registerListener(this);
  }

  reposition() {
    const pos = new KOTreePosition(this.model.getID(), this.model.getGroup(), this.tournament.getTeams().length, this.fullwidth.get());
    this.x = pos.x;
    this.y = pos.y;
    this.$view.css('left', this.x + 'em');
    this.$view.css('top', this.y + 'em');
  }

  onupdate() {
    this.reposition();
  }
}

export default KOMatchResultView;