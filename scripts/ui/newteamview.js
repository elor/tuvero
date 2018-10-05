/**
 * Represents a form with input elements and submit method, with which a new
 * team is to be added to the associated ListModel
 *
 * @return NewTeamView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "lib/extend", "core/view", "ui/newteamcontroller"],
  function ($, extend, View, NewTeamController) {

    function NewTeamView(model, $view, teamsize) {
      NewTeamView.superconstructor.call(this, model, $view);

      this.$players = this.$view.find("input.playername");
      this.$teamname = this.$view.find("input.teamname");
      this.$rankingpoints = this.$view.find("input.rankingpoints");
      this.$lines = this.$view.find(".newteamline");
      this.$button = this.$view.find("button.register");
      this.$advanced = this.$view.find(".registeradvanced");

      if (teamsize) {
        this.teamsize = teamsize;
        this.teamsize.registerListener(this);
        this.updateTeamSize();
      }

      this.controller = new NewTeamController(this);
    }
    extend(NewTeamView, View);

    NewTeamView.prototype.resetFields = function () {
      this.$players.val("");
      if (this.$players.typeahead) {
        this.$players.typeahead("val", "");
      }

      this.$teamname.val("");
      this.$rankingpoints.val(0);
    };

    NewTeamView.prototype.focusEmpty = function () {
      this.$players.each(function () {
        var $this;

        $this = $(this);

        if (!$this.attr("disabled") && /^\s*$/.test($this.val())) {
          $(this).focus();
          return false;
        }
      });
    };

    NewTeamView.prototype.updateTeamSize = function () {
      var teamsize;

      if (!this.teamsize) {
        console.error("NewTeamView.updateTeamSize called " +
          "without a valid teamsize model");
        return;
      }

      teamsize = this.teamsize.get();

      this.$players.each(function (index) {
        if (index < teamsize) {
          $(this).prop("disabled", false);
        } else {
          $(this).prop("disabled", true);
        }
      });

      this.$lines.each(function (index) {
        if (index < teamsize) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    };

    NewTeamView.prototype.onreset = function () {
      this.resetFields();
    };

    NewTeamView.prototype.onupdate = function (emitter) {
      if (emitter === this.teamsize) {
        this.updateTeamSize();
      }
    };

    return NewTeamView;
  });