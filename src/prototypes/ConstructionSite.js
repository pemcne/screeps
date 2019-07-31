Object.defineProperties(ConstructionSite.prototype, {
  memory: {
    get: () => {
      if (_.isUndefined(Memory.constructionSites)) {
        Memory.constructionSites = {};
      }
      if (_.isUndefined(Memory.constructionSites[this.id])) {
        Memory.constructionSites[this.id] = {};
      }
      return Memory.constructionSites[this.id];
    },
    set: (data) => {
      if (_.isUndefined(Memory.constructionSites)) {
        Memory.constructionSites = {};
      }
      Memory.constructionSites[this.id] = data;
    },
    configurable: true
  },
  workers: {
    get: () => {
      if (this.memory.workers) {
        return _.map(this.memory.workers, (id) => Game.getObjectById(id));
      }
      return null
    },
    set: (data) => {
      this.memory.constructionSites = _.map(data, 'id');
    },
    value: null
  }
});
