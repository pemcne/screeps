import { ActionType } from "actions";

const newAction = (type: ActionType, data: ActionData, repeat = false): ActionItem => {
  return {
    type: type,
    data: data,
    repeat: repeat
  };
};

abstract class BaseAction implements Action {
  public type: ActionType;
  public data: ActionData;
  public id: string;
  constructor(public creep: Creep, public rawData: ActionItem, public repeat: boolean = false) {
    this.type = rawData.type as ActionType;
    this.data = rawData.data;
    this.init();
    if (this.rawData.id === undefined) {
      this.id = _.uniqueId(`${this.creep.name}-${this.type}`);
    } else {
      this.id = this.rawData.id;
    }
    // if (this.rawData.dependsOn) {
    //   this.dependsOn = this.rawData.dependsOn;
    // } else {
    //   this.dependsOn = null;
    // }
  }
  abstract isComplete(): boolean;
  abstract run(): ActionItem | null;
  init() { }
  public counter() {
    if (this.data.count) {
      if (!this.data.iteraction) {
        this.data.iteration = 1;
      } else {
        this.data.iteraction++;
      }
    }
  }
  public countComplete(): boolean {
    if (this.data.count && this.data.iteraction) {
      return this.data.iteraction > this.data.count;
    }
    return false;
  }
}

export { BaseAction, newAction };
