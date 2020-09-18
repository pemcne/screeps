import { timeStamp } from "console";
import { Action, ActionType } from "./Action";

export enum TransferDirection {
  Withdraw,
  Deposit
}

export class Transfer extends Action {
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
  }
  run() {
    if (!this.creep.pos.isNearTo(this.target)) {
      const referral = {
        type: ActionType.Move,
        data: {
          target: {
            x: this.target.pos.x,
            y: this.target.pos.y
          }
        }
      };
      return referral;
    }
  }
}
