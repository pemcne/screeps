import CreepManager from "managers/CreepManager";
import ActionManager from "managers/ActionManager";
import { newAction } from "actions/BaseAction";
import { ActionType, TransferDirection } from "actions";
import { RoleType } from "creeps";

export default abstract class BaseCreep implements CreepRole {
  public creep: Creep;
  public actions: Action[];
  public role: RoleType;
  public name: string;
  protected manager: CreepManager;

  constructor(creep: Creep, manager: CreepManager) {
    this.creep = creep;
    this.name = this.creep.name;
    this.manager = manager;
    this.actions = this.loadActions();
    this.role = this.creep.memory.role as RoleType;
  }

  // Determine any follow up action for a completed action
  // Needs to be implemented at the child
  abstract actionComplete(action: Action): Action | null;

  get pos(): RoomPosition {
    return this.creep.pos;
  }

  addAction(action: ActionItem) {
    const a = ActionManager.load(this.creep, action);
    this.actions.unshift(a);
    // Push to memory in case run isn't being called because it is spawning
    this.saveActions();
  }
  loadActions() {
    let allActions: any[] = [];
    let memActions = this.creep.memory.actions as ActionItem[];
    if (memActions === undefined) {
      memActions = [];
    }
    memActions.forEach((a) => {
      const action = ActionManager.load(this.creep, a);
      allActions.push(action);
    });
    return allActions;
  }
  saveActions() {
    this.creep.memory.actions = _.map(this.actions, "rawData");
  }

  run() {
    if (this.actions.length === 0) {
      console.log("No actions???");
      return;
    }
    const action = this.actions[0];
    if (action.isComplete()) {
      this.actions.shift();
      // See if there's a follow up action to put in the queue
      const followup = this.actionComplete(action);
      if (followup !== null) {
        this.actions.push(followup);
      }
      if (action.repeat) {
        this.actions.push(action);
      }
      // Since we've organized the action queue, call run again
      this.run();
    } else {
      let actionOutput = action.run();
      // If it's null that means the action completed successfully
      // If there's an action that got returned, we need to push that to the queue
      if (actionOutput !== null) {
        const referral = ActionManager.load(this.creep, actionOutput);
        this.actions.unshift(referral);
        // Run the referral
        this.run();
      }
    }
    // Store the state in memory
    this.saveActions();
  }

  // HELPER FUNCTIONS
  // Define some common functions that all creeps should know how to do
  findClosestSource(): Source | null {
    return this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  }
  findClosestEnergyStorage(): StructureContainer | StructureStorage | null {
    const storage = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
          s.store[RESOURCE_ENERGY] > 0
        );
      }
    }) as StructureContainer | StructureStorage | null;
    return storage;
  }
  findEnergy(): ActionItem {
    const container = this.findClosestEnergyStorage();
    let action: ActionItem;
    if (container === null) {
      const source = this.findClosestSource();
      action = newAction(ActionType.Harvest, { target: source?.id });
    } else {
      const data = {
        target: container.id,
        type: RESOURCE_ENERGY,
        direction: TransferDirection.Withdraw
      };
      action = newAction(ActionType.Transfer, data);
    }
    return action;
  }
}
