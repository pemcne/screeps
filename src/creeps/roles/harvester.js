import { BaseCreep } from '../base';

export class Harvester extends BaseCreep {
  get source() {
    if (!this.creep.memory.harvester) {
      return null;
    }
    return Game.getObjectById(this.creep.memory.harvester.source);
  }
  constructor(creep) {
    super(creep);
    if (!this.creep.memory.harvester) {
      this.init();
    }
  }
  init() {
    this.creep.memory.harvester = {
      gathering: false,
      source: null
    };
  }
  run() {
    if (this.creep.memory.harvester.gathering && this.isFull()) {
      this.creep.memory.harvester.gathering = false;
    } else if (!this.creep.memory.harvester.gathering && this.isEmpty()) {
      this.creep.memory.harvester.gathering = true;
    }
    if (this.creep.memory.harvester.gathering) {
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
    const resp = this.depositEnergy();
    if (resp === ERR_FULL) {
      return this.upgradeController();
    }
    return resp;
  }
}
