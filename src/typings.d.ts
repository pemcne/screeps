declare const _;

interface CreepMemory {
  role: string;
  harvester?: any;
  actions: any;
}
interface RoomMemory {
  scanned: number;
  sources: Id<Source>[];
}
interface SourceMemory {
  container?: Id<Structure> | null;
  numFreeSpaces?: number;
}
interface BaseMemory {
  rooms: string[];
  creeps: string[];
  constructionRequests: any[];
}
interface Memory {
  sources: { [name: string]: SourceMemory };
  bases: { [name: string]: BaseMemory };
  creeps: { [name: string]: CreepMemory };
}

interface Room {
  scanned: number;
  sources: (Source | null)[];
}

interface Source {
  memory: SourceMemory;
  container: StructureContainer | null;
  numFreeSpaces: number;
}
interface Request {
  requester: any;
  target: any;
  fulfiller: any;
  data?: any;
  isComplete(): boolean;
}
