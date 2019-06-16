export enum Role {
  Harvester
}

declare global {
  interface CreepMemory {
    role: Role;
  }
}
