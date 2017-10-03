/**
 * CSVExportController
 *
 * @return CSVExportController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/controller', 'ui/state', 'presets',
    'lib/FileSaver', 'lib/Blob', 'ui/toast', 'ui/strings',
    'timemachine/timemachine'], function($, extend, Controller, State, Presets,
    saveAs, Blob, Toast, Strings, TimeMachine) {
  var validsets = ['teams', 'ranking', 'history'];

  /**
   * Constructor
   *
   * @param view
   *          a View which contains the CSV container
   */
  function CSVExportController(view) {
    var controller;
    CSVExportController.superconstructor.call(this, view);

    controller = this;

    this.$buttons = this.view.$view.find('button');

    this.$buttons.click(function() {
      var $button, classes;

      $button = $(this);
      classes = $button.attr('class').split(' ').filter(function (dataset) {
        return validsets.indexOf(dataset) !== -1;
      });

      controller.saveCSV(classes);
    });
  }
  extend(CSVExportController, Controller);

  CSVExportController.prototype.saveCSV = function(datasets) {
    var data, blob, filename, basename;

    if (!TimeMachine.isInitialized()) {
      new Toast(Strings.notournament, Toast.LONG);
      return;
    }

    basename = TimeMachine.commit.get().getTreeName() || Presets.target;
    filename = basename.substr(0, 64) + '_' + datasets.join('_') + '.csv';

    data = this.generateCSV(datasets);
    try {
      blob = new Blob([data], {
        type: 'text/csv'
      });
    } catch (e) {
      console.log(e.stack);
      new Toast(Strings.exportfailed, Toast.LONG);
    }

    if (!saveAs(blob, filename)) {
      console.error('saveAs failed!');
      new Toast(Strings.exportfailed, Toast.LONG);
    }
  };

  /**
   * create a shared CSV file
   *
   * @param datasets
   *          an array of strings, each of which is a dataset name (i.e. one of
   *          'ranking', 'history' or 'teams)
   * @return a combined CSV string of all datasets
   */
  CSVExportController.prototype.generateCSV = function(datasets) {
    var csvDataSets = datasets.filter(function(dataset) {
      return validsets.indexOf(dataset) !== -1;
    }).map(function(dataset) {
      if (this[dataset + 'ToCSV']) {
        return this[dataset + 'ToCSV']();
      }

      State.emit('error', 'missing CSV export function: ' + dataset);
      return 'CSV export failed for ' + dataset;
    }, this);

    return csvDataSets.join('\r\n\r\n');
  };

  /**
   * @return a CSV string which represents the registered teams
   */
  CSVExportController.prototype.teamsToCSV = function() {
    var csvLines;

    csvLines = State.teams.map(function(team) {
      var i, line;

      line = [team.getID() + 1];

      for (i = 0; i < team.length; i += 1) {
        line.push(this.escape(team.getPlayer(i).getName()));
      }

      return line.join(',');
    }, this);

    csvLines.unshift(Strings.csvheader_teams);

    return csvLines.join('\r\n');
  };

  /**
   * @return a CSV string which represents the ranking
   */
  CSVExportController.prototype.rankingToCSV = function() {
    var tournaments = State.tournaments.map(function(tournament) {
      var lines, ranking;

      ranking = tournament.getRanking().get();

      lines = ranking.displayOrder.map(function(displayID) {
        var teamID, fields;

        teamID = ranking.ids[displayID];
        fields = [ranking.ranks[displayID] + 1, teamID + 1];

        ranking.components.map(function(componentname) {
          fields.push(ranking[componentname][displayID]);
        });

        return fields.join(',');
      });

      lines.unshift(Strings.csvheader_ranking + ','
          + ranking.components.join(','));
      lines.unshift(this.escape(tournament.getName().get()));

      return lines.join('\r\n');
    }, this);

    return tournaments.join('\r\n\r\n');
  };

  /**
   * @return a CSV string which represents all past matches and byes, without
   *         placeholders
   */
  CSVExportController.prototype.historyToCSV = function() {
    var csvTournaments;

    csvTournaments = State.tournaments.map(function(tournament) {
      var lines = [this.escape(tournament.getName().get()),
          Strings.csvheader_history];

      tournament.getHistory().map(function(result) {
        var fields, i;

        fields = [];
        fields.push(result.getGroup() + 1);
        fields.push(result.getID() + 1);

        if (result.isResult()) {
          for (i = 0; i < result.length; i += 1) {
            if (i > 0 && result.isBye()) {
              fields.push(Strings.byeid);
            } else {
              fields.push(result.getTeamID(i) + 1);
            }
          }

          for (i = 0; i < result.length; i += 1) {
            fields.push(result.score[i]);
          }

          lines.push(fields.join(','));
        }
      }, this);

      return lines.join('\r\n');
    }, this);

    return csvTournaments.join('\r\n\r\n');
  };

  CSVExportController.prototype.escape = function(string) {
    string = '' + string;

    if (/[",]|\s/.test(string)) {
      string = string.replace(/"/g, '""');
      string = '"' + string + '"';
    }

    return string;
  };

  return CSVExportController;
});
