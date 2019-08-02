Object.defineProperties(ConstructionSite.prototype, {
  memory: {
    get: function() {
      if (_.isUndefined(Memory.constructionSites)) {
        Memory.constructionSites = {};
      }
      if (_.isUndefined(Memory.constructionSites[this.id])) {
        Memory.constructionSites[this.id] = {};
      }
      return Memory.constructionSites[this.id];
    },
    set: function(data) {
      if (_.isUndefined(Memory.constructionSites)) {
        Memory.constructionSites = {};
      }
      Memory.constructionSites[this.id] = data;
    },
    configurable: true
  },
  workers: {
    get: function() {
      if (this.memory.workers) {
        return _.map(this.memory.workers, (id) => Game.getObjectById(id));
      }
      return []
    },
    set: function(data) {
      this.memory.constructionSites = _.map(data, 'id');
    }
  },
  numWorkers: {
    get: function() {
      if (!this.memory.numWorkers) {
        // Assume each worker will do 2500
        this.memory.numWorkers = this.progressTotal / 2500;
      }
      return this.memory.numWorkers;
    }
  }
});
