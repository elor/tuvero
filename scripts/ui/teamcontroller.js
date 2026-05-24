import RenameController from './renamecontroller.js';
import Toast from './toast.js';
import Strings from './strings.js';
import State from './state.js';
import TabsHandle from './tabshandle.js';

class TeamController extends RenameController {
  constructor(view, $input) {
    super(view);
    this.view.$view.find('.teamno').click(this.openModal.bind(this));
  }

  getPlayer($name) {
    let index, $names;
    $names = this.view.$view.find('.name');
    if ($names.length === 0) {
      $names = this.view.$view.filter('.name');
    }
    index = $names.index($name);
    return this.model.getPlayer(index);
  }

  getNameModel($anchor) {
    if (this.$anchor.hasClass('teamname')) {
      return this.model;
    } else {
      return this.getPlayer(this.$anchor);
    }
  }

  getName() {
    let nameModel;
    if (!this.$anchor) {
      return '';
    }
    nameModel = this.getNameModel(this.$anchor);
    return nameModel.getName();
  }

  setName(name) {
    let nameModel;
    if (!this.$anchor) {
      return false;
    }
    nameModel = this.getNameModel(this.$anchor);
    nameModel.setName(name);
    return true;
  }

  openModal() {
    State.focusedteam.set(this.model);
    TabsHandle.focus('team');
  }

  destroy() {
    if (State.focusedteam.get() === this.model) {
      State.focusedteam.set(undefined);
    }
    super.destroy();
  }
}

export default TeamController;