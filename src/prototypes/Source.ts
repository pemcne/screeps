Object.defineProperties(Source.prototype, {
  memory: {
    get: function () {
      if (Memory.sources[this.id] === undefined) {
        Memory.sources[this.id] = {};
      }
      return Memory.sources[this.id];
    }
  },
  numFreeSpaces: {
    get: function () {
      if (this._spaces === undefined) {
        if (this.memory.numFreeSpaces === undefined) {
          this._spaces = -1;
          this.memory.numFreeSpaces = this._spaces;
        } else {
          this._spaces = this.memory.numFreeSpaces;
        }
      }
      return this._spaces;
    },
    set: function (data: number) {
      this._spaces = data;
      this.memory.numFreeSpaces = this._spaces;
    }
  },
  container: {
    get: function () {
      if (this._container === undefined) {
        if (this.memory.container === undefined) {
          this._container = undefined;
          this.memory.container = undefined;
        } else {
          this._container = Game.getObjectById(this.memory.container as Id<StructureContainer>);
        }
      }
      return this._container;
    },
    set: function (data: StructureContainer) {
      this._container = data;
      this.memory.container = this._container.id;
    }
  }
});
