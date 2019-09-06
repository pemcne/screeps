import Harvest from "../actions/HarvestAction";
import Move from "../actions/MoveAction";
import Transfer from '../actions/TransferAction';
import Upgrade from "../actions/UpgradeAction";
import Build from "../actions/BuildAction";

class ActionManager {
  constructor() {
    this.map = {
      harvest: Harvest,
      move: Move,
      transfer: Transfer,
      upgrade: Upgrade,
      build: Build
    };
  }
  load(creep, data) {
    if (!('type' in data)) {
      console.log('Action doesnt have any type?');
    }
    const actionClass = this.map[data.type];
    if (actionClass === undefined) {
      console.log('Action type does not exist');
    }
    const repeat = data.repeat ? data.repeat : false;
    // console.log('Making action', data.type, repeat);
    const actionObj = new actionClass(creep, data, repeat);
    return actionObj;
  }
}

export default new ActionManager();
