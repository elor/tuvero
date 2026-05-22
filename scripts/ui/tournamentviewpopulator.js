import $ from 'jquery';
import extend from '../lib/extend.js';
import View from '../core/view.js';
import GenericTournamentView from './generictournamentview.js';
import Listener from '../core/listener.js';
/**
 * Constructor
 *
 * @param $templatesArray
 *          a list of DOM elements which are templates
 */
function TournamentViewPopulator($templatesArray, tournaments) {
  const $templates = {};
  $templatesArray.each(function () {
    let $template, type;
    $template = $(this);
    type = $template.attr('data-system');
    $templates[type] = $template;
  });
  this.$templates = $templates;
  this.tournaments = tournaments;
  this.teamReservation = [];
  this.viewCache = [];
  Listener.bind(tournaments, 'insert', function (emitter, event, data) {
    const index = data.id;
    const tournament = data.object;
    const $view = $('<td>').addClass('system');
    this.populate(tournament, $view);
    const view = new GenericTournamentView(tournament, $view, this.tournaments);
    if (index === this.viewCache.length) {
      this.viewCache.push(view);
    } else {
      this.viewCache.splice(index, 0, view);
    }
  }, this);
  Listener.bind(tournaments, 'remove', function (emitter, event, data) {
    const index = data.id;
    const view = this.viewCache[index];
    this.viewCache.splice(index, 1);
    this.teamReservation.splice(index, 1);
    view.destroy();
  }, this);
}
extend(GenericTournamentView, View);

/**
 * populate a GenericTournamentView container with content, depending on the
 * tournament type. If the tournament is undefined, the "undefined" system
 * will be populated, i.e. the NewTournamentView container for starting new
 * tournaments.
 *
 * @param tournament
 *          a TournamentModel instance
 * @param $view
 *          an empty container for the actual view
 */
TournamentViewPopulator.prototype.populate = function (tournament, $view) {
  let type;
  type = tournament && tournament.SYSTEM;
  if (this.$templates[type] === undefined) {
    console.error('system template has not been loaded: ' + type);
  } else {
    $view.append(this.$templates[type].children().clone());
  }
};
TournamentViewPopulator.prototype.getCachedView = function (tournamentID, teamID) {
  this.teamReservation[tournamentID] = teamID;
  return this.viewCache[tournamentID];
};
TournamentViewPopulator.prototype.getViewTeamID = function (tournamentID) {
  return this.teamReservation[tournamentID];
};
export default TournamentViewPopulator;