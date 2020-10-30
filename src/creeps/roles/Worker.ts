import BaseCreep from "creeps/BaseCreep";
import { newAction } from "actions/BaseAction";
import { ActionType } from "actions";

export default class Worker extends BaseCreep {
  public static baseBody: BodyPartConstant[] = [WORK, WORK, CARRY, MOVE];
  public static repeatBody: BodyPartConstant[] = [WORK, CARRY, MOVE];
  public static minNumber = 2;

  static getInitialActions(room?: Room): ActionItem[] {
    const controller = room?.controller;
    const data = {
      target: controller?.id
    };
    const upgrade = newAction(ActionType.Upgrade, data, true);
    return [upgrade];
  }
  actionComplete(action: Action) {
    return null;
  }
}
