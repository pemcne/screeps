import { Harvester } from "./harvester";
import { Upgrader } from "./upgrader";

// Roles
export enum Role {
  HARVESTER,
  UPGRADER
}
export interface RoleMapElement {
  name: string;
  cls: any;
  body: BodyPartConstant[];
  upgradedBody: BodyPartConstant[];
  minNumber: number;
}
declare type RoleMapper = {
  [TKey in Role]: RoleMapElement;
};
export const RoleMap: RoleMapper = {
  [Role.HARVESTER]: {
    name: "harvester",
    cls: Harvester,
    body: [WORK, CARRY, MOVE, MOVE],
    upgradedBody: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    minNumber: 2
  },
  [Role.UPGRADER]: {
    name: 'upgrader',
    cls: Upgrader,
    body: [WORK, WORK, CARRY, MOVE],
    upgradedBody: [WORK, WORK, WORK, WORK, CARRY, MOVE],
    minNumber: 3
  }
};

interface HarvesterMemory {
  source: string;
  gathering: boolean;
}

declare global {
  interface CreepMemory {
    role: Role;
    harvester?: HarvesterMemory;
  }
}
