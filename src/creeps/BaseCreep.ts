export abstract class BaseCreep {
  public creep: Creep;
  protected abstract body: string[];
  protected abstract upgradedBody: string[];

  public constructor(creep: Creep) {
    this.creep = creep;
  }

  protected findEnergyStorage(room: Room): AnyStructure[] {
    const storage = room.find(FIND_STRUCTURES, {
      filter: structure =>
        structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE
    });
    return storage;
  }
}
