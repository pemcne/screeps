export enum Role {
  Harvester
}

interface HarvesterMemory {
  source: string;
  gathering: boolean;
}

declare global {
  interface CreepMemory {
    role: Role;
    harvester: HarvesterMemory;
  }
}
