/**
 * KOTreeView
 *
 * @return KOTreeView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './templateview', './listview', './komatchresultview'], //
function(extend, TemplateView, ListView, KOMatchResultView) {
  /**
   * Constructor
   *
   * @param tournament
   *          a TournamentModel instance
   * @param $view
   *          the table
   * @param groups
   *          a BinningReferenceListModel of MatchReferenceModels which are
   *          grouped by their match group
   * @param teamlist
   *          a ListModel of TeamModel instances
   * @param teamsize
   *          a ValueModel which represents the size of all registered teams
   */
  function KOTreeView(model, $view, teamlist, tournament, teamsize) {
    KOTreeView.superconstructor.call(this, model, $view, $view
        .find('.komatchresult.template'));

    console.log(this.$template);

    this.$forest = this.$view.find('.forest');

    this.matches = new ListView(this.model, this.$forest, this.$template,
        KOMatchResultView, teamlist, tournament, undefined);
  }
  extend(KOTreeView, TemplateView);

  return KOTreeView;
});
