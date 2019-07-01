import { BaseCreep } from "../base";

export class Worker extends BaseCreep {
  constructor(creep) {
    super(creep);
    if (!this.creep.memory.worker) {
      this.init();
    }
  }
  init() {
    this.creep.memory.worker = {
      working: false
    };
  }
  run() {
    if (this.creep.memory.worker.working && this.isEmpty()) {
      this.creep.memory.worker.working = false;
    }
    if (!this.creep.memory.worker.working && this.isFull()) {
      this.creep.memory.worker.working = true;
    }
    if (this.creep.memory.worker.working) {
      const controller = this.creep.room.controller;
      if (controller.ticksToDowngrade < 3000) {
        this.upgradeController();
      }
      const repair = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax / 2 && s.structureType !== STRUCTURE_WALL
      })
      if (repair !== null) {
        return this.repair(repair);
      }
      const site = this.findClosestConstructionSite();
      if (site !== null) {
        return this.build(site);
      } else {
        return this.upgradeController();
      }
    } else {
      return this.findEnergy();
    }

  }
}
