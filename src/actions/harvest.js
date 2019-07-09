import Action from "./base";
import ActionManager from './manager';

export default class Harvest extends Action {
  init() {
    this.source = Game.getObjectById(this.data.target);
  }
  isComplete() {
    return _.sum(this.creep.carry) === this.creep.carryCapacity;
  }
  run() {
    // See if we need to refer to moveTo
    if (!this.creep.pos.isNearTo(this.source)) {
      const referral = {
        type: 'move',
        data: {
          target: {
            x: this.source.pos.x,
            y: this.source.pos.y
          }
        }
      };
      return ActionManager.load(this.creep, referral);
    }
    this.creep.harvest(this.source);
  }
}
