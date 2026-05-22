/**
 * TournamentRankingView
 *
 * @return TournamentRankingView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import View from '../core/view.js';
import RankingView from './rankingview.js';
import ListView from './listview.js';
import PopoutBoxView from './popoutboxview.js';
import CorrectionView from './correctionview.js';
import TeamTableView from './teamtableview.js';
import ValueModel from '../core/valuemodel.js';
import Listener from '../core/listener.js';
import TournamentRenameController from './tournamentrenamecontroller.js';
import LengthModel from '../list/lengthmodel.js';
import ClassView from '../core/classview.js';
/**
 * Constructor
 *
 * @param model
 *          a TournamentModel instance
 * @param $view
 *          the container of the object
 * @param teams
 *          a ListModel of TeamModel instances which is referenced by index by
 *          TournamentModel.getRanking()
 */
function TournamentRankingView(model, $view, teams, abbreviate) {
  const $popout = $view.clone();
  TournamentRankingView.superconstructor.call(this, model, $view);
  this.renameController = new TournamentRenameController(new View(model, this.$view.find('.tournamentname.rename')));
  this.boxview = new PopoutBoxView(this.$view, $popout, function ($view) {
    return new TournamentRankingView(model, $view, teams, abbreviate);
  });
  this.$ranking = this.$view.find('.rankingview');
  this.rankingview = new RankingView(this.model.getRanking(), this.$ranking, teams, abbreviate);
  this.$corrections = this.$view.find('.correctiontable');
  this.correctionsVisibility = new ClassView(new LengthModel(this.model.getCorrections()), this.$corrections, undefined, 'hidden');
  this.$correctionrow = this.$corrections.find('.correctionrow.template').detach();
  this.corrections = new ListView(this.model.getCorrections(), this.$corrections, this.$correctionrow, CorrectionView);
  this.correctionTeamHideListener = new TeamTableView(this.corrections, new ValueModel(3));
  this.$names = this.$view.find('.tournamentname');
  Listener.bind(this.model.getName(), 'update', this.updateNames.bind(this));
  Listener.bind(this.model.getState(), 'update', this.updateVisibility.bind(this));
  this.updateNames();
  this.updateVisibility();
}
extend(TournamentRankingView, View);
TournamentRankingView.prototype.updateNames = function () {
  this.$names.text(this.model.getName().get());
};
TournamentRankingView.prototype.updateVisibility = function () {
  if (this.model.getState().get() === 'initial') {
    this.$view.addClass('hidden');
  } else {
    this.$view.removeClass('hidden');
  }
};
export default TournamentRankingView;