Object.defineProperty(Room.prototype, 'scanned', {
  get: () => this.memory.scanned,
  set: (data) => this.memory.scanned = data,
  value: null,
  writable: true
});

Object.defineProperty(Room.prototype, 'sources', {
  get: () => {
    if (!this._sources) {
      if (!this.memory.sourceIds) {
        this.memory.sourceIds = this.find(FIND_SOURCES).map(source => source.id);
      }
      this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
    }
    return this._sources;
  },
  set: (data) => {
    this.memory.sources = data.map(source => source.id);
    this._sources = data;
  },
  enumerable: false,
  configurable: true
});
