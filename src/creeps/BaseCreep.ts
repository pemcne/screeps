export abstract class BaseCreep {
  public creep: Creep;
  public abstract body: string[];
  public abstract upgradedBody: string[];

  public constructor(creep: Creep) {
    this.creep = creep;
  }

  public abstract run(): number;

  protected findClosestEnergyStorage(): AnyStructure | null {
    const storage = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure =>
        structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE
    });
    return storage;
  }
  protected findClosestSource(): Source | null {
    return this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  }
  protected moveTo(target: RoomPosition | { pos: RoomPosition }): number {
    return this.creep.moveTo(target, {
      visualizePathStyle: {
        fill: "#ffffff"
      }
    });
  }
  protected harvestEnergy(source: Source | null): number {
    if (source === null) {
      source = this.findClosestSource();
      if (source === null) {
        console.log(this.creep.name + ": no available sources");
        return ERR_NOT_FOUND;
      }
    }
    if (this.creep.pos.isNearTo(source.pos)) {
      return this.creep.harvest(source);
    } else {
      return this.moveTo(source);
    }
  }
  protected depositEnergy(): number {
    let container = this.findClosestEnergyStorage();
    if (container === null) {
      container = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
    }
    if (container !== null) {
      const resp = this.creep.transfer(container, RESOURCE_ENERGY);
      if (resp === ERR_NOT_IN_RANGE) {
        return this.moveTo(container);
      }
      return resp;
    }
    return ERR_NOT_FOUND;
  }
}
