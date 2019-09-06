import { BaseCreep } from "../BaseCree";

export class Hauler extends BaseCreep {
  constructor(creep) {
    super(creep);
    if (!this.creep.memory.hauler) {
      this.init();
    }
  }
}
