import Action from "./base";

export default class Harvest extends Action {
  constructor(creep, type, data) {
    super(creep, type, data);
    this.source = Game.getObjectById(this.data.target);
  }
  isComplete() {
    return _.sum(this.creep.carry) === this.creep.carryCapacity;
  }
  run() {
    // See if we need to refer to moveTo
    if (!this.creep.isNearTo(this.source)) {
      const referral = {
        type: 'move',
        data: {
          target: this.data.source
        }
      };
      return referral;
    }
    this.creep.harvest(this.source);
  }
}
