import { BaseCreep } from '../base';
import ActionManager from '../../actions/manager';

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
            type: RESOURCE_ENERGY
          }
        }
        return ActionManager.load(this.creep, referral);
      }
    }
  }
  // run() {
  //   // Modify this just to run through the actions
  //   if (this.creep.memory.harvester.gathering && this.isFull()) {
  //     this.creep.memory.harvester.gathering = false;
  //   } else if (!this.creep.memory.harvester.gathering && this.isEmpty()) {
  //     this.creep.memory.harvester.gathering = true;
  //   }
  //   if (this.creep.memory.harvester.gathering) {
  //     let source = this.source;
  //     if (source === null) {
  //       source = this.findClosestSource();
  //       if (source === null) {
  //         console.log(this.creep.name + ": no available sources");
  //         return ERR_NOT_FOUND;
  //       }
  //       this.creep.memory.harvester.source = source.id;
  //     }
  //     return this.harvestEnergy(source);
  //   }
  //   const resp = this.depositEnergy();
  //   if (resp === ERR_FULL) {
  //     return this.upgradeController();
  //   }
  //   return resp;
  // }
}
