Object.defineProperties(Room.prototype, {
  sources: {
    get: function () {
      if (this._sources === undefined) {
        if (this.memory.sources === undefined) {
          this._sources = this.find(FIND_SOURCES);
          this.memory.sources = this._sources.map((source: Source) => source.id);
        } else {
          this._sources = this.memory.sources.map((source: Id<Source>) => Game.getObjectById(source));
        }
      }
      return this._sources;
    }
  },
  scanned: {
    get: function () {
      if (this._scanned === undefined) {
        if (this.memory.scanned !== undefined) {
          this._scanned = this.memory.scanned;
        }
      }
      return this._scanned;
    },
    set: function (data: number) {
      this._scanned = data;
      this.memory.scanned = this._scanned;
    }
  }
});
