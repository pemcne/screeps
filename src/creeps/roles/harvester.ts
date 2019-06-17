import { BaseCreep } from "creeps/BaseCreep";

export class Harvester extends BaseCreep {
  get source(): Source | null {
    return Game.getObjectById<Source>(this.creep.memory.harvester.source);
  }

  public constructor(creep: Creep) {
    super(creep);
  }

  private findSource(): Source | null {
    return this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  }

  public harvest(): number {
    let source = this.source;
    if (source === null) {
      source = this.findSource();
      if (source === null) {
        console.log(this.creep.name + ": no available sources");
        return ERR_NOT_FOUND;
      }
    }
    if (this.creep.pos.isNearTo(source.pos)) {
      return this.creep.harvest(source);
    } else {
      return this.creep.moveTo(source);
    }
  }

  public deposit(): number {
    return 0;
  }
}
