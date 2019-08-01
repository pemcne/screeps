Object.defineProperties(Source.prototype, {
  memory: {
    get: () => {
      if (_.isUndefined(Memory.sources)) {
        Memory.sources = {};
      }
      if (_.isUndefined(Memory.sources[this.id])) {
        Memory.sources[this.id] = {};
      }
      return Memory.sources[this.id];
    },
    set: (data) => {
      if (_.isUndefined(Memory.sources)) {
        Memory.sources = {};
      }
      Memory.sources[this.id] = data;
    },
    configurable: true
  },
  numFreeSpaces: {
    get: () => this.memory.freeSpaces,
    set: (data) => this.memory.freeSpaces = data,
    value: null
  },
  container: {
    get: () => {
      if (this.memory.container) {
        return Game.getObjectById(this.memory.container);
      }
      return null;
    },
    set: (data) => {
      this.memory.container = data.id;
    },
    value: null
  }
});
