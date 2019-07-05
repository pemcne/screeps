import Action from "./base";

export default class Move extends Action {
  constructor(creep, type, data) {
    super(creep, type, data);
    this.target = Game.getObjectById(this.data.target);
  }
  isComplete() {
    return this.creep.isNearTo(this.target);
  }
  run() {
    this.creep.moveTo(target, {
      reusePath: 20,
      visualizePathStyle: {
        stroke: '#dddddd'
      }
    });
  }
}
