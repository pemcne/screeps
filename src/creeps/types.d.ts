declare interface CreepRole {
  creep: Creep;
  actions: Action[];
  role: string;
  name: string;
  actionComplete(action: Action): Action | null;
  pos: RoomPosition;
  addAction(action: Action): void;
  loadActions(): void;
  saveActions(): void;
  run(): void;
}
