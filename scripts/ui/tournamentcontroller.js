import RenameController from './renamecontroller.js';
import Toast from './toast.js';
import Strings from './strings.js';
let pendingNameChange;
pendingNameChange = undefined;

/**
* Constructor
*
* @param view
*          a TournamentView instance
*/
class TournamentController extends RenameController {
  constructor(view, tournaments) {
    let tournament, $runbutton;
    super(view, false);
    tournament = this.model.tournament;
    this.toast = undefined;
    this.$runbutton = this.view.$view.find('button.runtournament');
    this.$closebutton = this.view.$view.find('button.closetournament');
    $runbutton = this.$runbutton;
    this.$runbutton.click(function () {
      $runbutton.attr('disabled', true);
      tournament.run();
      window.setTimeout(function () {
        $runbutton.attr('disabled', false);
      }, 500);
    });
    this.$closebutton.click(function () {
      if (tournament.finish()) {
        tournaments.closeTournament(tournament.getID());
        Toast.once(Strings.tournamentfinished);
      } else {
        Toast.once(Strings.gamesstillrunning, Toast.LONG);
      }
    });
    if (pendingNameChange === this.model.tournament) {
      this.view.$view.find('.rename').eq(0).click();
      window.setTimeout(this.$rename.focus.bind(this.$rename), 1);
      window.setTimeout(this.$rename.select.bind(this.$rename), 1);
    }
  }

  getName() {
    return this.model.tournament.getName().get();
  }

  setName(name) {
    if (!name) {
      return false;
    }
    this.model.tournament.getName().set(name);
    pendingNameChange = undefined;
    return true;
  }

  destroy() {}

  static initiateNameChange(tournament) {
    pendingNameChange = tournament;
  }
}

export default TournamentController;