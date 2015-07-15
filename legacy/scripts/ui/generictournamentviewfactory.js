/**
 * GenericTournamentView
 *
 * @return GenericTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './generictournamentview',
    './newtournamentview'], function(extend, View, GenericTournamentView,
    NewTournamentView) {
  /**
   * Constructor
   *
   * @param $templatesArray
   *          a list of DOM elements which are templates
   */
  function GenericTournamentViewFactory($templatesArray) {
    var $templates = {};

    $templatesArray.each(function() {
      var $template, type;
      $template = $(this);
      type = $template.attr('data-system');

      $templates[type] = $template;
    });

    this.$templates = $templates;
  }
  extend(GenericTournamentView, View);

  /**
   * create a GenericTournamentView after inserting the correct
   *
   * @param tournaments
   *          a IndexedListModel of tournaments
   * @param tournamentID
   *          index of the tournament
   * @param $view
   *          an empty container for the actual view
   * @return a GenericTournamentView instance on success, undefined otherwise
   */
  GenericTournamentViewFactory.prototype.create = function(tournaments,
      tournamentID, $view) {
    var type, tournament;

    tournament = tournaments.get(tournamentID);
    type = tournament && tournament.SYSTEM;

    if (this.$templates[type] === undefined) {
      console.error('system template has not been loaded: ' + type);
      return undefined;
    }

    $view.append(this.$templates[type].children().clone());

    if (!tournament) {
      return new NewTournamentView(tournaments, $view);
    }

    return new GenericTournamentView(tournament, $view);
  };

  return GenericTournamentViewFactory;
});
