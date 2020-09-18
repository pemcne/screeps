declare const _;
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
  creeps: Id<Creep>[];
  constructionRequests: any[];
}
interface Memory {
  sources: { [name: string]: SourceMemory };
  bases: { [name: string]: BaseMemory };
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
