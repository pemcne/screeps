import { Action, ActionItem, ActionType } from "./Action";

export default class Harvest extends Action {
  public source!: Source;
  init() {
    const sourceSearch: Source | null = Game.getObjectById(this.data.target);
    if (sourceSearch === null) {
      throw new Error(`Unknown error passed into harvest: ${this.data.target}`);
    }
    this.source = sourceSearch;
  }
  isComplete() {
    return this.creep.carry.getFreeCapacity() === 0;
  }
  run() {
    // See if we need to refer to moveTo
    if (!this.creep.pos.isNearTo(this.source?.pos.x, this.source?.pos.y)) {
      const referral: ActionItem = {
        type: ActionType.Move,
        data: {
          target: {
            x: this.source.pos.x,
            y: this.source.pos.y
          }
        }
      };
      return referral;
    }
    this.creep.harvest(this.source);
    return null;
  }
}
