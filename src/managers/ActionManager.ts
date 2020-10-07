import Harvest from "actions/HarvestAction";
import Move from "actions/MoveAction";
import Transfer from "actions/TransferAction";

class ActionManager {
  private map!: {
    HARVEST: typeof Harvest;
    MOVE: typeof Move;
    TRANSFER: typeof Transfer;
  };
  constructor() {}
  load(creep: Creep, data: ActionItem): Action {
    const repeat = data.repeat ? data.repeat : false;
    switch (data.type) {
      case ActionType.Harvest:
        return new Harvest(creep, data, repeat);
      case ActionType.Move:
        return new Move(creep, data, repeat);
      case ActionType.Transfer:
        return new Transfer(creep, data, repeat);
      default:
        throw new Error(`Unknown action to load: ${data.type}`);
    }
  }
}

export default new ActionManager();
