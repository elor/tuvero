/**
 * TournamentHistoryView
 *
 * @return TournamentHistoryView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "core/view", "ui/listview", "ui/popoutboxview",
    "core/listener", "list/binningreferencelistmodel", "ui/matchtableview",
    "ui/generictournamenthistoryview", "ui/tournamentrenamecontroller"
  ], //
  function (extend, View, ListView, PopoutBoxView, Listener,
    BinningReferenceListModel, MatchTableView, GenericTournamentHistoryView,
    TournamentRenameController) {

    /**
     * Constructor
     *
     * @param model
     *          a TournamentModel from which all matches are read
     * @param $view
     *          the container
     * @param teamlist
     *          a ListModel of all TeamModels. Is referenced by ID by
     *          model.getCombinedHistory()
     * @param teamsize
     *          a ValueModel which represents the number of players in a team
     * @param fullwidth
     *          a ValueModel which evaluates to true if any name should be shown
     */
    function TournamentHistoryView(model, $view, teamlist, teamsize, fullwidth) {
      var $popoutTemplate = $view.clone();
      TournamentHistoryView.superconstructor.call(this, model, $view);

      this.renameController = new TournamentRenameController(new View(model,
        this.$view.find(".tournamentname.rename")));
      this.boxview = new PopoutBoxView(this.$view, $popoutTemplate, function (
        $view) {
        return new TournamentHistoryView(model, $view, teamlist, teamsize,
          fullwidth);
      });

      this.$names = this.$view.find(".tournamentname");
      this.teamlist = teamlist;
      this.teamsize = teamsize;
      this.fullwidth = fullwidth;

      this.groups = new BinningReferenceListModel(
        this.model.getCombinedHistory(), TournamentHistoryView.groupFilter);

      this.initGenericView();
      this.initMatches();

      Listener.bind(this.model.getName(), "update", this.updateNames.bind(this));

      Listener.bind(this.model.getCombinedHistory(), "resize",
        this.updateVisibility.bind(this));

      this.updateVisibility();

      this.updateNames();
    }
    extend(TournamentHistoryView, View);

    TournamentHistoryView.groupFilter = function (matchresult) {
      return matchresult.getGroup();
    };

    /**
     * initializes matchtable
     */
    TournamentHistoryView.prototype.initMatches = function () {
      this.$matchtable = this.$view.find(".matchtable");

      if (this.genericView.showlists) {
        // nested ListViews: BinningReferenceListModel is 2D
        this.matchtable = new ListView(this.groups, this.$view, this.$matchtable,
          MatchTableView, this.teamlist, this.model, this.teamsize);

        this.$view.addClass("haslists");
      } else {
        this.$matchtable.remove();
        this.matchtable = undefined;
      }
    };

    TournamentHistoryView.prototype.initGenericView = function () {
      this.genericView = new GenericTournamentHistoryView(this.model, this.$view,
        this.groups, this.teamlist, this.teamsize, this.fullwidth);
    };

    TournamentHistoryView.prototype.updateVisibility = function () {
      if (this.model.getCombinedHistory().length === 0) {
        this.$view.addClass("hidden");
      } else {
        this.$view.removeClass("hidden");
      }
    };

    TournamentHistoryView.prototype.updateNames = function () {
      this.$names.text(this.model.getName().get());
    };

    return TournamentHistoryView;
  });