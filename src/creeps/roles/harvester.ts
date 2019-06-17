/// <reference path="harvester.d.ts" />

import { Role } from "./role";

export class Harvester implements HarvesterInterface {
  public creep: Creep;

  get memory(): HarvesterCreepMemory {
    return this.creep._memory().harvester;
  }
  get source(): Source | null {
    return Game.getObjectById<Source>(this.creep._memory().harvester.source);
  }

  public constructor(creep: Creep) {
    this.creep = creep;
    if (this.creep._memory().role !== Role.Harvester) {
      this.creep._memory().role = Role.Harvester;
    }
    if (this.creep._memory().harvester == null) {
      this.creep._memory().harvester = {
        source: ""
      };
    }
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
