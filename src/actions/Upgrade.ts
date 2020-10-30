import { ActionType } from "actions";
import { BaseAction, newAction } from "./BaseAction";

export default class Upgrade extends BaseAction {
  public target!: StructureController;
  init() {
    const controller: StructureController | null = Game.getObjectById(this.data.target);
    if (controller === null) {
      throw new Error(`Unknown controller passed into upgrade ${this.data.target}`);
    }
    this.target = controller;
  }
  isComplete() {
    if (super.countComplete()) {
      return true;
    }
    return false;
  }
  run() {
    if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      // put in an energy request
    } else if (!this.creep.pos.inRangeTo(this.target, 3)) {
      const targetData = {
        target: {
          x: this.target.pos.x,
          y: this.target.pos.y
        },
        range: 3
      };
      const referral = newAction(ActionType.Move, targetData);
      return referral;
    }
    this.creep.upgradeController(this.target);
    return null;
  }
}
