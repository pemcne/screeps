import { BaseCreep } from "creeps/BaseCreep";

export class Harvester extends BaseCreep {
  public body = [WORK, CARRY, MOVE, MOVE];
  public upgradedBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
  get source(): Source | null {
    if (!this.creep.memory.harvester) {
      return null;
    }
    return Game.getObjectById<Source>(this.creep.memory.harvester.source);
  }

  public constructor(creep: Creep) {
    super(creep);
    if (!this.creep.memory.harvester) {
      this.init();
    }
  }
  private init(): number {
    this.creep.memory.harvester = {
      gathering: false,
      source: ""
    };
    return OK;
  }
  public run() {
    if (!this.creep.memory.harvester) {
      return this.init();
    }
    if (this.creep.memory.harvester.gathering && this.isFull()) {
      this.creep.memory.harvester.gathering = false;
      return this.depositEnergy();
    } else if (!this.creep.memory.harvester.gathering && this.isEmpty()) {
      this.creep.memory.harvester.gathering = true;
    }
    // Need to harvest
    let source = this.source;
    if (source === null) {
      source = this.findClosestSource();
      if (source === null) {
        console.log(this.creep.name + ": no available sources");
        return ERR_NOT_FOUND;
      }
      this.creep.memory.harvester.source = source.id;
    }
    return this.harvestEnergy(source);
  }
  private isFull(): boolean {
    return this.creep.carry[RESOURCE_ENERGY] === this.creep.carryCapacity;
  }
  private isEmpty(): boolean {
    return this.creep.carry[RESOURCE_ENERGY] === 0;
  }
}
