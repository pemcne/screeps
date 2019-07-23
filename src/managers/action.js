import Harvest from "../actions/harvest";
import Move from "../actions/move";
import Transfer from '../actions/transfer';
import Upgrade from "../actions/upgrade";

class ActionManager {
  constructor() {
    this.map = {
      harvest: Harvest,
      move: Move,
      transfer: Transfer,
      upgrade: Upgrade
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
    const actionObj = new actionClass(creep, data.type, data.data, repeat);
    return actionObj;
  }
}

export default new ActionManager();
