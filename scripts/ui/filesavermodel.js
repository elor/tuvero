import Model from '../core/model.js';
import { saveAs } from 'file-saver';
import TimeMachine from '../timemachine/timemachine.js';
import Presets from 'presets';

/**
 * Constructor: Constructs a FileSaverModel instance around the given commit
 *
 * @param commit
 *          A CommitModel instance. Defaults to the current commit if
 *          undefined
 */
class FileSaverModel extends Model {
  constructor(commit) {
    super();
    this.commit = commit;
  }

  /**
   * save the contained commit, or the current commit if it has been set to
   * undefined
   *
   * @return true on success, false otherwise
   */
  save() {
    let commit, basename, filename, data, blob, saveState;
    commit = this.commit || TimeMachine.commit.get();
    if (!commit) {
      console.error('FileSaver: There is no commit to save');
      return false;
    }
    if (!commit.isValid()) {
      console.error('FileSaver: The commit is not valid');
      return false;
    }
    basename = commit.getTreeName() || Presets.target;
    filename = basename.replace(/(\.json)+$/, '').substr(0, 64) + '.json';
    data = commit.load();
    if (!data) {
      console.error('FileSaver: commit contains no data');
      return false;
    }
    try {
      blob = new Blob([data], {
        type: 'application/json'
      });
    } catch (e) {
      console.error('FileSaver: Blob creation failed');
      console.error(e.stack);
      return false;
    }
    try {
      saveState = saveAs(blob, filename);
    } catch (e) {
      console.error('FileSaver: saveAs failed');
      return false;
    }
    if (!saveState) {
      return false;
    }
    return true;
  }
}

export default FileSaverModel;