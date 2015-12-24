/**
 * TeamFormatDownloadController
 *
 * @return TeamFormatDownloadController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'lib/FileSaver', 'lib/Blob',
    './toast', './strings', 'presets'], function(extend, Controller, saveAs,
    Blob, Toast, Strings, Presets) {
  var examplefile;

  examplefile = "# Ein Team pro Zeile, Spielernamen mit Komma getrennt\n"
      + "# Alle Teams müssen gleiche Größe haben\n"
      + "Erik E. Lorenz, Fabian \"Fabe\" Böttcher\n"
      + "Spieler 3, \"Spieler 4\"\n";

  /**
   * Constructor
   */
  function TeamFormatDownloadController(view) {
    var controller;
    TeamFormatDownloadController.superconstructor.call(this, view);

    this.view.$view.click(this.save.bind(this));
  }
  extend(TeamFormatDownloadController, Controller);

  TeamFormatDownloadController.prototype.save = function() {
    var blob;

    try {
      blob = new Blob([examplefile]);
      saveAs(blob, Presets.names.teamsfile);
    } catch (e) {
      console.error(e.stack);
      new Toast(Strings.savefailed);
    }
  };

  return TeamFormatDownloadController;
});
