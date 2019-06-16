interface CreepMemory {
  harvester: HarvesterCreepMemory;
}
interface HarvesterCreepMemory {
  source: string;
}
interface HarvesterInterface {
  creep: Creep;
  harvest(): number;
}
