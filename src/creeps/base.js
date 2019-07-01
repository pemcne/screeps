class BaseCreep {
  constructor(creep) {
    this.creep = creep;
  }

  findClosestConstructionSite() {
    return this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
  }
  findClosestSource() {
    return this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  }
  findClosestEnergyStorage() {
    const storage = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => {
        return (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0;
      }
    });
    return storage;
  }
  findEnergy() {
    const container = this.findClosestEnergyStorage();
    if (container === null) {
      const source = this.findClosestSource();
      this.harvestEnergy(source);
    } else {
      this.withdraw(container);
    }
  }
  build(target) {
    const resp = this.creep.build(target);
    if (resp === ERR_NOT_IN_RANGE) {
      return this.moveTo(target);
    }
    return resp;
  }
  depositEnergy() {
    let container = this.findClosestEnergyStorage();
    if (container === null || _.sum(container.store) === container.storeCapacity) {
      container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          if (s.structureType in [STRUCTURE_EXTENSION, STRUCTURE_SPAWN]) {
            return s.energy < s.energyCapacity;
          }
          return false;
        }
      });
      if (container === null) {
        return ERR_FULL;
      }
    }
    const resp = this.creep.transfer(container, RESOURCE_ENERGY);
    if (resp === ERR_NOT_IN_RANGE) {
      return this.moveTo(container);
    }
    return resp;
  }
  harvestEnergy(source) {
    if (this.creep.pos.isNearTo(source.pos)) {
      return this.creep.harvest(source);
    } else {
      return this.moveTo(source)
    }
  }
  isFull() {
    return this.creep.carry[RESOURCE_ENERGY] === this.creep.carryCapacity;
  }
  isEmpty() {
    return this.creep.carry[RESOURCE_ENERGY] === 0;
  }
  moveTo(target) {
    return this.creep.moveTo(target, {
      reusePath: 20,
      visualizePathStyle: {
        stroke: '#dddddd'
      }
    })
  }
  repair(target) {
    const resp = this.creep.repair(target);
    if (resp === ERR_NOT_IN_RANGE) {
      return this.moveTo(target);
    }
    return resp;
  }
  upgradeController() {
    const controller = this.creep.room.controller;
    const resp = this.creep.upgradeController(controller);
    if (resp === ERR_NOT_IN_RANGE) {
      return this.moveTo(controller);
    }
    return resp
  }
  withdraw(target) {
    const resp = this.creep.withdraw(target, RESOURCE_ENERGY);
    if (resp === ERR_NOT_IN_RANGE) {
      return this.moveTo(target);
    }
    return resp;
  }
}

export {
  BaseCreep
};
