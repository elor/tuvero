/**
 * Represents a form with input elements and submit method, with which a new
 * team is to be added to the associated ListModel
 *
 * @return NewTeamView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(
    ['lib/extend', './view', './newteamcontroller'],
    function(extend, View, NewTeamController) {
      /**
       * Constructor
       *
       * @param model
       *          a ListModel for containing the teams
       * @param $view
       *          a form which contains two input elements and a submit button
       * @param teamsize
       *          Optional. A ValueModel instance which represents the team
       *          size.
       */
      function NewTeamView(model, $view, teamsize) {
        NewTeamView.superconstructor.call(this, model, $view);

        this.$players = this.$view.find('input.playername');
        this.$lines = this.$view.find('>.names>');

        if (teamsize) {
          this.teamsize = teamsize;
          this.teamsize.registerListener(this);
          this.updateTeamSize();
        }

        this.controller = new NewTeamController(this);
      }
      extend(NewTeamView, View);

      /**
       * clear the name input fields
       */
      NewTeamView.prototype.resetNames = function() {
        this.$players.val('');
        if (this.$players.typeahead) {
          this.$players.typeahead('val', '');
        }
      };

      /**
       * focus the first empty or whitespace-only name input field
       */
      NewTeamView.prototype.focusEmpty = function() {
        this.$players.each(function() {
          var $this;

          $this = $(this);

          if (!$this.attr('disabled') && /^\s*$/.test($this.val())) {
            $(this).focus();
            return false;
          }
        });
      };

      /**
       * update the entry team size by enabling/disabling the input fields
       */
      NewTeamView.prototype.updateTeamSize = function() {
        var teamsize;

        if (!this.teamsize) {
          console
              .error('NewTeamView.updateTeamSize called without a valid teamsize model');
          return;
        }

        teamsize = this.teamsize.get();

        this.$players.each(function(index) {
          if (index < teamsize) {
            $(this).prop('disabled', false);
          } else {
            $(this).prop('disabled', true);
          }
        });

        this.$lines.each(function(index) {
          if (index < teamsize) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      };

      /**
       * Callback function, after resetting the teams
       *
       * Note to self: the 'reset' event is fired by the model, which is a
       * ListView containing the teams. Do not fire 'reset' on this model
       * manually!
       */
      NewTeamView.prototype.onreset = function() {
        this.resetNames();
      };

      /**
       * Callback function
       *
       * @param emitter
       */
      NewTeamView.prototype.onupdate = function(emitter) {
        if (emitter === this.teamsize) {
          this.updateTeamSize();
        }
      };

      return NewTeamView;
    });
