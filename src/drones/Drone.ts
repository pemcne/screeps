import DroneManager from "managers/DroneManager";

class Drone {
  protected creep: Creep;
  protected name: Id<Creep>;
  protected manager: DroneManager;
  protected actions: Action[];
  protected role: RoleType;

  constructor(creep: Creep, manager: DroneManager) {
    this.creep = creep;
    this.name = this.creep.name as Id<Creep>;
    this.manager = manager;
    this.actions = this.loadActions();
    this.role = this.creep.memory.role as RoleType;
  }

  get pos(): RoomPosition {
    return this.creep.pos;
  }

  
}
