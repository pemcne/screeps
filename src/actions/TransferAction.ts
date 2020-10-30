import { ActionType, TransferDirection } from "actions";
import { BaseAction, newAction } from "./BaseAction";

export default class Transfer extends BaseAction {
  public target!: AnyStoreStructure;
  public resourceType!: ResourceConstant;
  public amount!: number;
  public direction!: TransferDirection;
  init() {
    this.target = this.findTarget(this.data.target);
  }
  findTarget(target: Id<AnyStoreStructure>): AnyStoreStructure {
    const obj: AnyStoreStructure | null = Game.getObjectById(target);
    if (obj === null) {
      throw new Error(`Unknown id: ${target}`);
    }
    return obj;
  }
  isComplete() {
    if (this.creep.store.getUsedCapacity(this.resourceType)) {
      return true;
    }
    return false;
  }
  run() {
    if (!this.creep.pos.isNearTo(this.target)) {
      const targetData = {
        x: this.target.pos.x,
        y: this.target.pos.y
      };
      const referral = newAction(ActionType.Move, targetData);
      return referral;
    }
    return null;
  }
}
