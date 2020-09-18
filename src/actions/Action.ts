enum ActionType {
  Harvest = "HARVEST",
  Move = "MOVE",
  Transfer = "TRANSFER",
  Upgrade = "UPGRADE",
  Build = "BUILD"
}

interface ActionItem {
  type: ActionType;
  data: { [key: string]: any };
  repeat?: boolean;
}

interface ReferralItem {
  type: ActionType;
  query?: string;
}

abstract class Action {
  public type: ActionType;
  public data: { [key: string]: any };
  public id: string;
  constructor(public creep: Creep, public rawData: { [key: string]: any }, public repeat: boolean = false) {
    this.type = rawData.type;
    this.data = rawData.data;
    this.init();
    if (!this.rawData.id) {
      this.rawData.id = _.uniqueId(`${this.creep.name}-${this.type}`);
    }
    this.id = this.rawData.id;
    // if (this.rawData.dependsOn) {
    //   this.dependsOn = this.rawData.dependsOn;
    // } else {
    //   this.dependsOn = null;
    // }
  }
  abstract isComplete(): boolean;
  abstract run(): ActionItem | ReferralItem | null;
  init() {}
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

export { Action, ActionType, ActionItem, ReferralItem };
