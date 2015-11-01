/**
 * TournamentController
 *
 * @return TournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/controller', './toast', './strings'], //
function(extend, jquery, Controller, Toast, Strings) {
  var pendingNameChange;

  pendingNameChange = undefined;

  /**
   * Constructor
   *
   * @param view
   *          a TournamentView instance
   */
  function TournamentController(view, tournaments) {
    var tournament, rankingOrder;
    TournamentController.superconstructor.call(this, view);

    tournament = this.model.tournament;
    rankingOrder = this.model.rankingOrder;

    this.toast = undefined;

    this.$runbutton = this.view.$view.find('button.runtournament');
    this.$closebutton = this.view.$view.find('button.closetournament');
    this.$toptitle = this.view.$view.find('>h3:first-child');
    this.$nameinput = this.$toptitle.find('input');

    this.$nameinput.blur(this.closeNameInput.bind(this));
    this.$nameinput.keydown(function(e) {
      switch (e.which) {
      case 13: // enter
        $(this).blur();
        break;
      case 27: // escape
        $(this).val(tournament.getName().get());
        $(this).blur();
        break;
      default:
        return true;
      }
      e.preventDefault();
      return false;
    });

    this.$runbutton.click(function() {
      if (tournament.getState().get() === 'initial') {
        if (rankingOrder.length < 1) {
          tournament.emit('error', 'not enough ranking components');
          return;
        }
        if (!tournament.setRankingOrder(rankingOrder.asArray())) {
          return;
        }
      }
      tournament.run();
    });

    this.$closebutton.click(function() {
      var state;

      if (tournament.finish()) {
        tournaments.closeTournament(tournament.getID());
        new Toast(Strings.tournamentfinished);
      } else {
        new Toast(Strings.gamesstillrunning, Toast.LONG);
      }
    });

    this.$toptitle.click(this.showNameInput.bind(this));

    if (pendingNameChange === this.model.tournament) {
      this.showNameInput();
      window.setTimeout(this.$nameinput.focus.bind(this.$nameinput), 1);
      window.setTimeout(this.$nameinput.select.bind(this.$nameinput), 1);
    }
  }
  extend(TournamentController, Controller);

  TournamentController.prototype.showNameInput = function() {
    this.$nameinput.val(this.model.tournament.getName().get());
    this.$toptitle.addClass('rename');

    this.$nameinput.focus();
    this.$nameinput.select();

    if (this.toast) {
      this.toast.display();
    } else {
      this.toast = new Toast(Strings.namechangeprompt, Toast.INFINITE);
    }
  };

  TournamentController.prototype.closeNameInput = function() {
    var name;

    if (!this.$toptitle.hasClass('rename')) {
      return;
    }

    name = this.$nameinput.val();
    name = name.replace(/^\s+|\s+$/, '');
    if (name) {
      this.model.tournament.getName().set(name);
      // TODO move into separate listener class/object (own file or something)
      new Toast(Strings.namechanged.replace('%s', this.model.tournament
          .getName().get()));
    } else {
      new Toast(Strings.namechangeaborted);
    }
    this.$toptitle.removeClass('rename');

    this.toast.close();

    pendingNameChange = undefined;
  };

  /**
   * @param tournament
   *          a TournamentModel instance
   */
  TournamentController.initiateNameChange = function(tournament) {
    pendingNameChange = tournament;
  };

  TournamentController.prototype.destroy = function() {
    this.closeNameInput();
  };

  return TournamentController;
});
