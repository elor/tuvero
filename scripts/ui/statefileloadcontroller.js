/**
 * FileLoadController
 *
 * @return FileLoadController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import FileLoadController from './fileloadcontroller.js';
import StateSaver from './statesaver.js';
import StateLoader from './stateloader.js';
import Toast from './toast.js';
import Strings from './strings.js';
/**
 * Constructor
 *
 * @param $button
 *          the file load button
 */
function StateFileLoadController($button) {
  StateFileLoadController.superconstructor.call(this, $button);
}
extend(StateFileLoadController, FileLoadController);

/**
 * load the file as json or teams-csv.
 *
 * @param fileContents
 */
StateFileLoadController.prototype.readFile = function (fileContents) {
  Toast.closeTemporaryToasts();
  try {
    // TODO use filename until the tournament name is stored in the file,
    // too
    StateSaver.newTree(this.file.name.replace(/(\.(json|txt|csv))+$/, ''));
    if (StateLoader.loadString(fileContents)) {
      StateSaver.saveState();
      Toast.closeTemporaryToasts();
      Toast.once(Strings.loaded, Toast.LONG);
    } else {
      Toast.once(Strings.loadfailed, Toast.LONG);
      // TODO what if something invalid has been returned?
    }
  } catch (err) {
    Toast.once(Strings.loadfailed, Toast.LONG);
    // perform a complete reset of the everything related to the
    // tournament
  }
};

/**
 * Unload the current save state to avoid confusion. If a tournament fails,
 * there should be no active tournament, instead of just keeping the currently
 * open one.
 */
StateFileLoadController.prototype.unreadFile = function () {
  StateLoader.unload();
};
export default StateFileLoadController;