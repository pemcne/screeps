import Action from "./base";

export default class Move extends Action {
  init() {
    this.target = this.data.target;
  }
  isComplete() {
    return this.creep.pos.isNearTo(this.target.x, this.target.y);
  }
  run() {
    if (this.creep.fatigue) {
      return;
    }
    this.creep.moveTo(this.target.x, this.target.y, {
      reusePath: 20,
      visualizePathStyle: {
        stroke: '#dddddd'
      }
    });
  }
}
