/**
 * CSVExportController
 *
 * @return CSVExportController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', './state_new'], function(extend,
    Controller, State) {
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
    var data;

    data = this.generateCSV(datasets);

    console.log(data);
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
