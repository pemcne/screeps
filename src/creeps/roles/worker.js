import { BaseCreep } from "../base";

export class Worker extends BaseCreep {
  static getInitialActions(room) {
    const controller = room.controller;
    return [{
      type: 'upgrade',
      data: {
        target: controller.id
      },
      repeat: true
    }];
  }
  get available() {
    if (!this.creep.memory.available) {
      this.available = true;
    }
    return this.creep.memory.available;
  }
  set available(avail) {
    this.creep.memory.available = avail;
  }
}
