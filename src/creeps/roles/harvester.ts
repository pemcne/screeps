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

  public harvest(): number {
    if (this.creep.pos.isNearTo(this.source.pos)) {
    }
  }
}
