import Action from "./base";

export default class Build extends Action {
  init() {
    this.target = Game.getObjectById(this.data.target);
  }
  isComplete() {
    return this.target === null
  }
  run() {
    if (this.creep.carry.RESOURCE_ENERGY === 0) {
      const referral = {
        type: 'query',
        query: 'getEnergy'
      }
      return referral;
    } else if (!this.creep.pos.inRangeTo(this.target, 3)) {
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
    this.creep.build(this.target);
  }
}
