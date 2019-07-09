import Action from "./base";

export default class Repair extends Action {
  init() {
    this.target = Game.getObjectById(this.data.target);
  }
  isComplete() {
    return this.target.hits > (this.target.hitsMax * 0.75);
  }
  run() {
    if (this.creep.carry.RESOURCE_ENERGY === 0) {
      const referral = {
        type: 'query',
        query: 'getEnergy'
      }
      return referral;
    } else if (!this.creep.pos.isRangeTo(this.target, 3)) {
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
    this.creep.repair(this.target);
  }
}
