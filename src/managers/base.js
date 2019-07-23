class BaseManager {
  constructor(name) {
    this.name = name;
    if (name in Memory.bases) {
      this.load();
    } else {
      // This is a new base so init
      this.init();
    }
    this.save();
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
}

export default BaseManager;
