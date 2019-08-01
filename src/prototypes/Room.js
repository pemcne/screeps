Object.defineProperties(Room.prototype, {
  scanned: {
    get: function() {
      if (!this.memory.scanned) {
        return null;
      }
      return this.memory.scanned;
    },
    set: function(data) {
      this.memory.scanned = data
    }
  },
  sources: {
    get: function() {
      if (!this._sources) {
        if (!this.memory.sourceIds) {
          this.memory.sourceIds = this.find(FIND_SOURCES).map(source => source.id);
        }
        this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
      }
      return this._sources;
    },
    set: function(data) {
      this.memory.sources = data.map(source => source.id);
      this._sources = data;
    },
    enumerable: false,
    configurable: true
  }
});
