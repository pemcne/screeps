import RoomManager from './room';
import CreepManager from './creep';

class BaseManager {
  constructor(name) {
    this.name = name;
  }
  static newBase(name, room) {
    Memory.bases[name] = {
      'rooms': [room.name]
    };
  }
  get rooms() {
    const rooms = Memory.bases[this.name].rooms;
    return _.map(rooms, (r) => Game.rooms[r]);
  }
  set rooms(rooms) {
    const save = _.map(rooms, 'name');
    Memory.bases[this.name].rooms = save;
  }
  get spawns() {
    const spawns = Memory.bases[this.name].spawns;
    if (!spawns) {
      return this.rooms[0].find(FIND_MY_SPAWNS);
    }
    return _.map(spawns, (s) => Game.spawns[s]);
  }
  set spawns(spawns) {
    const save = _.map(spawns, 'id');
    Memory.bases[this.name].spawns = save;
  }
  get creeps() {
    const creeps = Memory.bases[this.name].creeps;
    if (!creeps) {
      return [];
    }
    return _.map(creeps, (c) => Game.creeps[c]);
  }
  set creeps(creeps) {
    const save = _.map(creeps, 'id');
    Memory.bases[this.name].creeps = save;
  }
  get constructionSites() {
    const sites = Memory.bases[this.name].constructionSites;
    if (!sites) {
      return [];
    }
    return _.map(sites, (s) => Game.getObjectById(s));
  }
  set constructionSites(sites) {
    Memory.bases[this.name].constructionSites = _.map(sites, 'id');
  }
  run() {
    this.rooms.forEach((room) => {
      const roomPlanner = new RoomManager(this, room);
      roomPlanner.scan();
    });
    // const creepManager = new CreepManager(this);
    // creepManager.run();
  }
}

export default BaseManager;
