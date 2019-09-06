import Action from "./BaseAction";

export default class Move extends Action {
  init() {
    this.target = this.data.target;
    this.range = this.data.range ? this.data.range : 1;
  }
  isComplete() {
    return this.creep.pos.inRangeTo(this.target.x, this.target.y, this.range);
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
