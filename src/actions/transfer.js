import Action from "./base";

export default class Transfer extends Action {
  init() {
    this.target = this.findTarget(this.data.target);
    this.resourceType = this.data.type;
    this.amount = this.data.amount;
  }
  findTarget(target) {
    let obj = Game.getObjectById(target);
    if (!obj) {
      // See if it's a spawn
      if (target in Game.spawns) {
        return Game.spawns[target];
      } else if (target in Game.creeps) {
        return Game.creeps[target];
      }
    }
    return obj;
  }
  isComplete() {
    if (this.creep.carry[this.resourceType] === 0) {
      return true;
    }
    if ([STRUCTURE_SPAWN, STRUCTURE_EXTENSION].includes(this.target.structureType)) {
      return this.target.energy === this.target.energyCapacity;
    } else if ([STRUCTURE_CONTAINER, STRUCTURE_STORAGE].includes(this.target.structureType)) {
      return _.sum(this.target.store) === this.target.storeCapacity;
    } else {
      console.log('What are you trying to deposit to??', this.data.target);
    }
  }
  run() {
    if (!this.creep.pos.isNearTo(this.target)) {
      const referral = {
        type: 'move',
        data: {
          target: {
            x: this.target.pos.x,
            y: this.target.pos.y
          }
        }
      };
      return referral;
    }
    if (this.amount) {
      this.creep.transfer(this.target, this.resourceType, this.amount);
    } else {
      this.creep.transfer(this.target, this.resourceType);
    }
  }
}
