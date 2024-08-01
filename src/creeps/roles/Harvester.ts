import { ActionType, TransferDirection } from "actions";
import { newAction } from "actions/BaseAction";
import BaseCreep from "creeps/BaseCreep";
import ActionManager from "managers/ActionManager";

export default class Harvester extends BaseCreep {
  public static baseBody: BodyPartConstant[] = [WORK, WORK, CARRY, MOVE];
  public static repeatBody: BodyPartConstant[] = [WORK, WORK, CARRY, MOVE];
  public static minNumber: number = 2;

  static getInitialActions(room?: Room): ActionItem[] {
    const source = Object.keys(Memory.sources)[0];
    const harvest = newAction(ActionType.Harvest, { target: source }, true);
    return [harvest];
  }
  actionComplete(action: Action): Action | null {
    switch (action.type) {
      case ActionType.Harvest:
        // Just finished harvesting, need to deposit
        let deposit: StructureContainer | StructureSpawn | StructureExtension | null;
        const container = Memory.sources[action.data.target].container as Id<StructureContainer>;
        if (!container) {
          deposit = this.findDeposit();
          if (deposit === null) {
            return null;
          }
        } else {
          deposit = Game.getObjectById(container);
        }
        if (deposit === null) {
          return deposit;
        }
        const rData = {
          target: deposit.id,
          type: RESOURCE_ENERGY,
          direction: TransferDirection.Deposit
        };
        const referral = newAction(ActionType.Transfer, rData);
        return ActionManager.load(this.creep, referral);
    }
    return null;
  }
  get source(): Source | null {
    if (!this.creep.memory.harvester) {
      return null;
    }
    const obj = Game.getObjectById(this.creep.memory.harvester.source);
    return obj as Source
  }
  private findDeposit(): StructureSpawn | StructureExtension | null {
    // See if there's an extension
    const ext = this.creep.room.find(FIND_MY_STRUCTURES, {
      filter: (s) => {
        if (s.structureType == STRUCTURE_EXTENSION) {
          return s.store.getFreeCapacity(RESOURCE_ENERGY) != 0;
        }
        return false;
      }
    }) as StructureExtension[];
    if (ext.length !== 0) {
      return ext[0];
    }
    const spawn = this.creep.room.find(FIND_MY_SPAWNS);
    if (spawn.length !== 0) {
      return spawn[0];
    }
    return null;
  }
}
