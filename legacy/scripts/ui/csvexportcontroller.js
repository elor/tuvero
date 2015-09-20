/**
 * CSVExportController
 *
 * @return CSVExportController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', './state_new', 'options',
    'lib/FileSaver', 'lib/Blob', './toast', './strings'], function(extend,
    Controller, State, Options, saveAs, Blob, Toast, Strings) {
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
      classes = $button.attr('class').split(' ');

      controller.saveCSV(classes);
    });
  }
  extend(CSVExportController, Controller);

  CSVExportController.prototype.saveCSV = function(datasets) {
    var data, blob;

    data = this.generateCSV(datasets);
    try {
      blob = new Blob([data], {
        type: 'text/csv'
      });
      saveAs(blob, Options.csvfile);
    } catch (e) {
      new Toast(Strings.exportfailed, Strings.LONG);
    }

  };

  CSVExportController.prototype.generateCSV = function(datasets) {
    var csvDataSets = datasets.map(function(dataset) {
      if (this[dataset + 'ToCSV']) {
        return this[dataset + 'ToCSV']();
      }

      State.emit('error', 'missing CSV export function: ' + dataset);
      return 'CSV export failed for ' + dataset;
    }, this);

    return csvDataSets.join('\r\n\r\n');
  };

  CSVExportController.prototype.teamsToCSV = function() {
    return 'teams';
  };

  CSVExportController.prototype.rankingToCSV = function() {
    return 'ranking';
  };

  CSVExportController.prototype.historyToCSV = function() {
    return 'history';
  };

  CSVExportController

  return CSVExportController;
});
