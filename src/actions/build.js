import Action from "./base";

export default class Build extends Action {
  init() {
    this.target = Game.getObjectById(this.data.target);
  }
  isComplete() {
    return this.target === null
  }
  run() {
    if (!this.creep.pos.isRangeTo(this.target, 3)) {
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
    // Get energy if out?
    this.creep.build(this.target);
  }
}
