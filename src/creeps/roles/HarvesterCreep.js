import { BaseCreep } from '../BaseCree';
import ActionManager from '../../managers/action';

export class Harvester extends BaseCreep {
  static getInitialActions() {
    // Run through Memory.sources and find ones without all harvesters
    const source = Object.keys(Memory.sources)[0];
    return [{
      type: 'harvest',
      data: {
        target: source
      },
      repeat: true
    }];
  }
  get source() {
    if (!this.creep.memory.harvester) {
      return null;
    }
    return Game.getObjectById(this.creep.memory.harvester.source);
  }
}
