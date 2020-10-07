import { BaseAction } from "./BaseAction";

export default class Build extends BaseAction {
  public target!: ConstructionSite;
  init() {
    const search: ConstructionSite | null = Game.getObjectById(this.data.target);
    if (search === null) {
      console.log("Unknown construction site passed to build", this.data.target);
    } else {
      this.target = search;
    }
  }
  isComplete() {
    if (this.countComplete()) {
      return true;
    }
    return this.target.progress === this.target.progressTotal;
  }
  run() {
    if (this.creep.store.getCapacity(RESOURCE_ENERGY) === 0) {
      // Query the creep for the energy target
      const referral: ActionItem = {
        type: ActionType.Harvest,
        data: {
          target: null
        }
      };
      return referral;
    } else if (!this.creep.pos.inRangeTo(this.target, 3)) {
      const referral: ActionItem = {
        type: ActionType.Move,
        data: {
          target: {
            x: this.target.pos.x,
            y: this.target.pos.y
          },
          range: 3
        }
      };
      return referral;
    }
    this.creep.build(this.target);
    this.counter();
    return null;
  }
}
