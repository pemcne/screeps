import ActionManager from '../actions/manager';

class BaseCreep {
  constructor(creep) {
    this.creep = creep;
    this.actions = this.loadActions();
  }

  loadActions() {
    let allActions = [];
    let memActions = this.creep.memory.actions;
    if (memActions === undefined) {
      memActions = [];
    }
    memActions.forEach((a) => {
      const action = ActionManager.load(this.creep, a);
      // figure out which way to push this in
      allActions.push(action);
    });
    return allActions;
  }

  run() {
    console.log(this.actions);
    if (this.actions.length === 0) {
      console.log('No actions?');
      return
    }
    const action = this.actions[0];
    if (action.isComplete()) {
      this.actions.shift();
      // See if there's a follow up action to put in the queue
      const resp = this.actionComplete(action);
      if (resp) {
        console.log('got a follow up action', resp.type);
        this.actions.push(resp);
      }
      if (action.repeat) {
        this.actions.push(action);
      }
      this.run();
    } else {
      const resp = action.run();
      if (resp) {
        // Got a referral
        this.actions.unshift(resp);
        this.run();
      }
    }
    // Store the state in memory
    this.creep.memory.actions = this.actions;
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
