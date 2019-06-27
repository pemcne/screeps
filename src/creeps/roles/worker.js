import { BaseCreep } from "../base";

export class Worker extends BaseCreep {
  constructor(creep) {
    super(creep);
    if (!this.creep.worker) {
      this.init();
    }
  }
  init() {
    this.creep.memory.worker = {
      working: false
    }
  }
  run() {
    if (this.creep.worker.working && this.isEmpty()) {
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
      const site = this.findClosestConstructionSite();
      if (site !== null) {
        this.build(site);
      } else {
        this.findEnergy();
      }
    }

  }
}
