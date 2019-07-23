import { BaseCreep } from '../base';
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
  actionComplete(action) {
    if (action.type === 'harvest') {
      // Prefer to jump off at a container
      const container = Memory.sources[action.data.target].container;
      if (!container) {
        // Try to put it at the spawn/extensions
        let spawner = this.creep.room.find(FIND_MY_SPAWNS, {
          filter: (s) => s.energy < s.energyCapacity
        });
        let target;
        if (spawner.length) {
          target = spawner[0].name;
        } else {
          spawner = this.creep.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
          });
          if (spawner === null) {
            return
          }
          target = spawner.id;
        }
        const referral = {
          type: 'transfer',
          data: {
            target: target,
            type: RESOURCE_ENERGY,
            direction: 'deposit'
          }
        }
        return ActionManager.load(this.creep, referral);
      }
    }
  }
}
