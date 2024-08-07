import { ActionType, TransferDirection } from "actions";
import { BaseAction, newAction } from "./BaseAction";

export default class Transfer extends BaseAction {
  public target!: AnyStoreStructure;
  public resourceType!: ResourceConstant;
  public amount!: number;
  public direction!: TransferDirection;
  public data!: TransferActionData;
  init() {
    this.target = this.findTarget(this.data.target);
    this.resourceType = this.data.type;
    this.direction = this.data.direction as TransferDirection;
  }
  findTarget(target: Id<AnyStoreStructure>): AnyStoreStructure {
    const obj: AnyStoreStructure | null = Game.getObjectById(target);
    if (obj === null) {
      throw new Error(`Unknown id: ${target}`);
    }
    return obj;
  }
  isComplete() {
    const done = this.creep.store.getUsedCapacity() === 0;
    return done;
  }
  run() {
    if (!this.creep.pos.isNearTo(this.target)) {
      const targetData = {
        target: {
          x: this.target.pos.x,
          y: this.target.pos.y
        }
      };
      const referral = newAction(ActionType.Move, targetData);
      return referral;
    }
    this.creep.transfer(this.target, this.resourceType)
    return null;
  }
}
