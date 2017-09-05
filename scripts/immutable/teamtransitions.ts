import * as TeamModel from "ui/teammodel"
import * as PlayerModel from "ui/playermodel"

interface TeamAddTransition {
  action: string,
  names: [string]
}

interface TeamRemoveTransition {
  action: string,
  index: number
}

const TeamTransitions = {
  "team:add": (state: StateModel, transition: TeamAddTransition) => {
    state.teams.push(new TeamModel(transition.names.map(
      () => new PlayerModel(name)
    )))
  },
  "team:remove": (state: StateModel, transition: TeamRemoveTransition) => {
    state.teams.remove(transition.index);
  }
}

export default { TeamTransitions }
