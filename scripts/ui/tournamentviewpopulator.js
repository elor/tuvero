/**
 * GenericTournamentView
 *
 * @return GenericTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/view', 'ui/generictournamentview'], //
function($, extend, View, GenericTournamentView) {
  /**
   * Constructor
   *
   * @param $templatesArray
   *          a list of DOM elements which are templates
   */
  function TournamentViewPopulator($templatesArray) {
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
  TournamentViewPopulator.prototype.populate = function(tournament, $view) {
    var type;

    type = tournament && tournament.SYSTEM;

    if (this.$templates[type] === undefined) {
      console.error('system template has not been loaded: ' + type);
    } else {
      $view.append(this.$templates[type].children().clone());
    }
  };

  return TournamentViewPopulator;
});
