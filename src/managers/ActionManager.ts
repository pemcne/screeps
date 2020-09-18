import { Action } from "actions/Action";


class ActionManager {
  private map!: { [key: string]: Action }
  constructor() {
  }
  load(creep: Creep, data: any) {
    if (!("type" in data)) {
      console.log("Action doesn't have a type");
    }
    const actionClass = this.map[data.type];
    if (actionClass === undefined) {
      console.log("Action type doesn't exist");
    }
    const repeat = data.repeat ? data.repeat : false;
    const actionObj: Action = new actionClass(creep, data, repeat);
    return actionObj;
  }
}
