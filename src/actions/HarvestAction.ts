import { ActionType } from "actions";
import { BaseAction, newAction } from "./BaseAction";

export default class Harvest extends BaseAction {
  public source!: Source;
  init() {
    const sourceSearch: Source | null = Game.getObjectById(this.data.target as Id<Source>);
    if (sourceSearch === null) {
      throw new Error(`Unknown error passed into harvest: ${this.data.target}`);
    }
    this.source = sourceSearch;
  }
  isComplete() {
    return this.creep.store.getFreeCapacity() === 0;
  }
  run() {
    // See if we need to refer to moveTo
    if (!this.creep.pos.isNearTo(this.source?.pos.x, this.source?.pos.y)) {
      const targetData = {
        target: {
          x: this.source.pos.x,
          y: this.source.pos.y
        }
      };
      const referral = newAction(ActionType.Move, targetData);
      return referral;
    }
    this.creep.harvest(this.source);
    return null;
  }
}
