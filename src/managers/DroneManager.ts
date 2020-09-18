import Manager from "./Manager";

export default class DroneManager extends Manager {
  memoryKey = "creeps";
  init() {
    super.init();
    //this.loadCreeps(this.base.creeps);
  }
  run() {
    const spawn = Game.spawns.Spawn1;
    const roomName = Object.keys(Game.rooms)[0];
    const room = Game.rooms[roomName];
    let spawning = spawn.spawning;

    //this.assignWorkers();
  }
  private loadCreeps(creeps: Array<Creep>) {}
}
