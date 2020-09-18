import ConstructionRequest from "requests/ConstructionRequest";
import RoomManager from "./RoomManager";

export default class BaseManager {
  public name: string;
  public rooms: Room[] = [];
  public constructionRequests: ConstructionRequest[] = [];
  public get memory(): BaseMemory {
    if (Memory.bases[this.name] === undefined) {
      throw new Error("Call newBase to bootstrap a new base");
    }
    return Memory.bases[this.name];
  }
  constructor(name: string) {
    this.name = name;
    this.init();
  }
  static newBase(name: string, room: Id<Room>) {
    // Just bootstrap
    Memory.bases[name] = {
      rooms: [room],
      creeps: [],
      constructionRequests: []
    };
  }
  init() {
    // Populate from memory if anything
    this.rooms = this.memory.rooms.map((room) => Game.rooms[room]);
    if (this.memory.constructionRequests.length > 0) {
      this.constructionRequests = this.memory.constructionRequests.map((data) => ConstructionRequest.load(data));
    }
  }
  save() {
    this.memory.rooms = this.rooms.map((room) => room.name);
    console.log("First construction", this.constructionRequests[0].export());
    this.memory.constructionRequests = this.constructionRequests.map((cr) => cr.export());
  }
  run() {
    console.log(`Running base ${this.name}`);
    const roomManager = new RoomManager(this);
    roomManager.run();
    this.save();
  }
}
