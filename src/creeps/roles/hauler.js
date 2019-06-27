import { BaseCreep } from "../base";

export class Hauler extends BaseCreep {
  constructor(creep) {
    super(creep);
    if (!this.creep.memory.hauler) {
      this.init();
    }
  }
}
