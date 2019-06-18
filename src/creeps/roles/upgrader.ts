import { BaseCreep } from "creeps/BaseCreep";

export class Upgrader extends BaseCreep {
  public constructor(creep: Creep) {
    super(creep);
  }
  public run() {
    return OK;
  }
}
