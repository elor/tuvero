/**
 * Represents a form with input elements and submit method, with which a new
 * team is to be added to the associated ListModel
 *
 * @return NewTeamView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import View from '../core/view.js';
import NewTeamController from './newteamcontroller.js';

class NewTeamView extends View {
  constructor(model, $view, teamsize) {
    super(model, $view);
    this.$players = this.$view.find('input.playername');
    this.$teamname = this.$view.find('input.teamname');
    this.$rankingpoints = this.$view.find('input.rankingpoints');
    this.$lines = this.$view.find('.newteamline');
    this.$button = this.$view.find('button.register');
    this.$advanced = this.$view.find('.registeradvanced');
    if (teamsize) {
      this.teamsize = teamsize;
      this.teamsize.registerListener(this);
      this.updateTeamSize();
    }
    this.controller = new NewTeamController(this);
  }

  resetFields() {
    this.$players.val('');
    if (this.$players.typeahead) {
      this.$players.typeahead('val', '');
    }
    this.$teamname.val('');
    this.$rankingpoints.val(0);
  }

  focusEmpty() {
    this.$players.each(function () {
      let $this;
      $this = $(this);
      if (!$this.attr('disabled') && /^\s*$/.test($this.val())) {
        $(this).focus();
        return false;
      }
    });
  }

  updateTeamSize() {
    let teamsize;
    if (!this.teamsize) {
      console.error('NewTeamView.updateTeamSize called ' + 'without a valid teamsize model');
      return;
    }
    teamsize = this.teamsize.get();
    this.$players.each(function (index) {
      if (index < teamsize) {
        $(this).prop('disabled', false);
      } else {
        $(this).prop('disabled', true);
      }
    });
    this.$lines.each(function (index) {
      if (index < teamsize) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  onreset() {
    this.resetFields();
  }

  onupdate(emitter) {
    if (emitter === this.teamsize) {
      this.updateTeamSize();
    }
  }
}

export default NewTeamView;