import { RoleType } from "creeps";
import CreepManager from "./CreepManager";
import RoomManager from "./RoomManager";

export default class BaseManager {
  public name: string;
  public rooms: Room[] = [];
  public creeps: { [name: string]: Creep | null } = {};
  private get memory(): BaseMemory {
    if (Memory.bases[this.name] === undefined) {
      throw new Error("Call newBase to bootstrap a new base");
    }
    return Memory.bases[this.name];
  }
  constructor(name: string) {
    this.name = name;
    this.init();
  }
  static newBase(name: string, room: string) {
    // Just bootstrap
    Memory.bases[name] = {
      rooms: [room],
      creeps: []
    };
  }
  init() {
    // Populate from memory if anything
    this.memory.creeps.forEach((name) => {
      // Id of creep is not known until spawned so name is the best way to do it for now
      const obj = Game.creeps[name];
      this.creeps[name] = obj !== undefined ? obj : null;
    });
    this.rooms = this.memory.rooms.map((room) => Game.rooms[room]);
  }
  save() {
    this.memory.creeps = Object.keys(this.creeps);
    this.memory.rooms = this.rooms.map((room) => room.name);
  }
  run() {
    console.log(`Running base ${this.name}`);
    console.log("Worker", RoleType.worker);
    const creepManager = new CreepManager(this);
    creepManager.run();
    const roomManager = new RoomManager(this);
    roomManager.run();
    this.save();
  }
}
