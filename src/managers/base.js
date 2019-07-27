import RoomManager from './room';

class BaseManager {
  constructor(name, room) {
    this.name = name;
    const baseObj = Memory.bases[this.name];
    if (Object.entries(baseObj).length === 0 && baseObj.constructor === Object) {
      // This is a new base so init
      this.init();
    } else {
      this.load();
    }
    this.save();
  }
  get rooms() {
    let rooms = Memory.bases[this.name].rooms;
    if (!rooms) {
      return Object.values(Game.rooms);
    }
    return rooms;
  }
  set rooms(rooms) {
    const save = _.map(rooms, 'id');
    Memory.bases[this.name].rooms = save;
  }
  get spawns() {
    const spawns = Memory.bases[this.name].spawns;
    if (!spawns) {
      return this.rooms[0].find(FIND_MY_SPAWNS);
    }
    return spawns;
  }
  set spawns(spawns) {
    const save = _.map(spawns, 'name');
    Memory.bases[this.name].spawns = save;
  }
  get creeps() {
    const creeps = Memory.bases[this.name].creeps;
    if (!creeps) {
      return [];
    }
    return creeps;
  }
  set creeps(creeps) {
    const save = _.map(creeps, 'name');
    Memory.bases[this.name].creeps = save;
  }
  init() {
    this.rooms = Object.values(Game.rooms);
    this.spawns = this.rooms[0].find(FIND_MY_SPAWNS);
    this.creeps = [];
    Memory.bases[this.name] = {};
  }
  load() {
    this.rooms = _.map(Memory.bases[this.name].rooms, (r) => Game.rooms[r]);
    this.spawns = _.map(Memory.bases[this.name].spawns, (s) => Game.spawns[s]);
    this.creeps = _.map(Memory.bases[this.name].creeps, (c) => Game.creeps[c]);
  }
  save() {
    const rooms = _.map(this.rooms, 'name');
    const spawns = _.map(this.spawns, 'name');
    const creeps = _.map(this.creeps, 'id');
    Memory.bases[this.name].rooms = rooms;
    Memory.bases[this.name].spawns = spawns;
    Memory.bases[this.name].creeps = creeps;
  }
  run() {
    this.rooms.forEach((room) => {
      const roomPlanner = new RoomManager(this, room);
      roomPlanner.scan();
    })
  }
}

export default BaseManager;
