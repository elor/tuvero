import * as StateModel from "ui/statemodel"
import Transition from "immutable/transition"

interface Transition {
  action: string;
}

class State {
  state: StateModel;
  transitions: [Transition];

  constructor() {
    this.state = new StateModel();
  }
}

export { State }
