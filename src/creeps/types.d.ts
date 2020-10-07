declare enum RoleType {
  harvester = "harvester",
  worker = "worker",
  hauler = "hauler"
}

declare interface CreepRole {
  creep: Creep;
  actions: Action[];
  role: RoleType;
  name: string;
  actionComplete(action: Action): Action | null;
  pos: RoomPosition;
  addAction(action: Action): void;
  loadActions(): void;
  saveActions(): void;
  run(): void;
}
