Object.defineProperties(Source.prototype, {
  memory: {
    get: function() {
      if (_.isUndefined(Memory.sources)) {
        Memory.sources = {};
      }
      if (_.isUndefined(Memory.sources[this.id])) {
        Memory.sources[this.id] = {};
      }
      return Memory.sources[this.id];
    },
    set: function(data) {
      if (_.isUndefined(Memory.sources)) {
        Memory.sources = {};
      }
      Memory.sources[this.id] = data;
    },
    configurable: true
  },
  numFreeSpaces: {
    get: function() {
      return this.memory.freeSpaces
    },
    set: function(data) {
      this.memory.freeSpaces = data
    }
  },
  container: {
    get: function() {
      if (this.memory.container) {
        return Game.getObjectById(this.memory.container);
      }
      return null;
    },
    set: function(data) {
      if (typeof(data) === 'string') {
        this.memory.container = data;
      } else {
        this.memory.container = data.id;
      }
    }
  }
});
