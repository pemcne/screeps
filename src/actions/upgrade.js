import Action from './base';

export default class Upgrade extends Action {
  init() {
    this.target = Game.getObjectById(this.data.target);
  }
  isComplete() {
    // You can always upgrade a controller
    return false;
  }
  run () {
    if (!this.creep.pos.inRangeTo(this.target, 3)) {
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
    if (this.creep.carry[RESOURCE_ENERGY] === 0) {
      // Get the closest container or harvest?
    }
    this.creep.upgradeController(this.target);
  }
}
