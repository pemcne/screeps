import RoomManager from './RoomManager';
import CreepManager from './CreepManager';

class BaseManager {
  constructor(name) {
    this.name = name;
    this.init();
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
  get controllers() {
    const ownedRooms = _.filter(this.rooms, room => room.controller.my);
    return _.map(ownedRooms, (room) => room.controller);
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
    const save = _.map(creeps, 'name');
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
    // TODO: optimize this, every loop we are cycling through all sites
    let save = sites;
    save.forEach((i, index, obj) => {
      if (i === null) {
        console.log('removing from sites', index);
        obj.splice(index, 1);
      }
    });
    Memory.bases[this.name].constructionSites = _.map(save, 'id');
  }
  init() {
    if (!Memory.bases[this.name].creeps) {
      Memory.bases[this.name].creeps = [];
    }
  }
  addCreep(creep) {
    // This will take a name of a creep and just push it into memory
    Memory.bases[this.name].creeps.push(creep);
  }
  run() {
    const roomPlanner = new RoomManager(this);
    roomPlanner.run();
    const creepManager = new CreepManager(this);
    creepManager.run();
  }
}

export default BaseManager;
