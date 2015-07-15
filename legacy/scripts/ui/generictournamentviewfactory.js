/**
 * GenericTournamentView
 *
 * @return GenericTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './generictournamentview'], function(extend,
    View, GenericTournamentView) {
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
   * @param tournament
   *          a TournamentModel instance
   * @param $view
   *          an empty container for the actual view
   * @return a GenericTournamentView instance on success, undefined otherwise
   */
  GenericTournamentViewFactory.prototype.create = function(tournament, $view) {
    var type;

    type = tournament && tournament.SYSTEM;

    if (this.$templates[type] === undefined) {
      return undefined;
    }

    $view.append(this.$templates[type].children().clone());

    return new GenericTournamentView(tournament, $view);
  };

  return GenericTournamentViewFactory;
});
