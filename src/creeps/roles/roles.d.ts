export enum Role {
  Harvester
}

interface HarvesterMemory {
  source: string;
}

declare global {
  interface CreepMemory {
    role: Role;
    harvester: HarvesterMemory;
  }
}
