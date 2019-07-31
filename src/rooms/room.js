class Room {
  constructor(room) {
    this.name = room.name;
    this.room = room;
    this.controller = room.controller;
    this.rcl = this.controller.my ? controller.level : null;
    if (Memory.rooms[this.name] === undefined) {
      Memory.rooms[this.name] = {
        sources: {},
        _updateSites: [],
        scanned: null
      }
    }
  }
  get sources() {
    return Memory.rooms[this.name].sources;
  }
  set sources(sources) {
    Memory.rooms[this.name].sources = sources;
  }
  get _updateSites() {
    return Memory.rooms[this.name]._updateSites;
  }
  set _updateSites(sites) {
    Memory.rooms[this.name]._updateSites = sites;
  }
  get scanned() {
    return Memory.rooms[this.name].scanned;
  }
  set scanned(scanned) {
    Memory.rooms[this.name].scanned = scanned;
  }

  generateRangeCoordinates(start, end) {
    // Given -5 and 5, this will generate an array of [-5, -4, ... 4, 5]
    return Array.from({ length: (end - start + 1) }, (v, k) => k + start);
  }
  scanEdge(xPerm, yPerm, sX, sY) {
    let output = [];
    for (const x of xPerm) {
      const tX = sX + x;
      for (const y of yPerm) {
        const tY = sY + y;
        if (tX === sX && tY === sY) {
          continue;
        }
        output.push(new RoomPosition(tX, tY, this.name));
      }
    }
    return output
  }
  getAllAdjacent(source, range) {
    const sX = source.x;
    const sY = source.y;
    const rangeMin = Math.abs(range) * -1;
    const rangeMax = Math.abs(range);
    const perm = this.generateRangeCoordinates(rangeMin, rangeMax);
    const permEdge = [rangeMin, rangeMax];
    const permShort = _.xor(perm, permEdge);
    const edgeX = this.scanEdge(perm, permEdge, sX, sY);
    const edgeY = this.scanEdge(permEdge, permShort, sX, sY);
    return [...edgeX, ...edgeY];
  }
  chooseContainer(source, range) {
    // This does a really basic lookup and chooses the closest of the
    // spots to the closest spawn, should be "good enough" for a container
    // First find the closest spawn
    const spawn = source.findClosestByPath(FIND_MY_SPAWNS, {
      ignoreCreeps: true
    });
    if (spawn === null) {
      // This really shouldn't happen...
      return null;
    }
    const goal = {
      pos: source,
      range: 1
    };
    const path = PathFinder.search(spawn.pos, goal, { heuristicWeight: 2 });
    const spot = path.path[path.path.length - range];
    new RoomVisual(this.name).circle(spot.x, spot.y, { opacity: 1, fill: '#ff0000' });
    return spot;
  }
  findFreeSpaces(terrain, source, range = 1) {
    const pos = source.pos;
    const adjacent = this.getAllAdjacent(pos, range);
    let freeSpaces = [];
    for (const adj of adjacent) {
      const terrainType = terrain.get(adj.x, adj.y);
      if (terrainType !== TERRAIN_MASK_WALL) {
        freeSpaces.push(adj);
        new RoomVisual(this.name).circle(adj.x, adj.y, { opacity: 1 });
      }
    }
    return freeSpaces;
  }
  canBuild(structure) {
    // Pulls the structure from CONTROLLER_STRUCTURES
    // Compares against built structures and returns boolean
    if (!(this.rcl in CONTROLLER_STRUCTURES[structure])) {
      return ERR_NOT_FOUND;
    }
    const avail = CONTROLLER_STRUCTURES[structure][this.rcl];
    const built = this.room.find(FIND_STRUCTURES, {
      filter: s => s.structureType === structure
    });
    return built.length < avail;
  }
  build(pos, structure) {
    // Returns the id of the construction site if successful
    // Returns null otherwise
    if (this.canBuild(structure)) {
      const resp = this.room.createConstructionSite(pos.x, pos.y, structure);
      if (!resp) {
        // Build succeeded
        const site = {
          x: pos.x,
          y: pos.y
        };
        let sites = this._updateSites;
        sites.push(site);
        this._updateSites = sites;
      }
      return resp;
    }
    return null;
  }
  buildContainer(target, range, memTarget, defaultParams) {
    if (memTarget === undefined) {
      memTarget = defaultParams;
    }
    if (memTarget.container === null && memTarget._pos === null) {
      // Build was unsuccessful last time
      const container = this.chooseContainer(target.pos, range);
      const resp = this.build(container, STRUCTURE_CONTAINER);
      if (!resp) {
        memTarget._pos = {
          x: container.x,
          y: container.y,
          type: STRUCTURE_CONTAINER
        }
      }
    } else if (memTarget.container) {
      // Just check if it's valid
      if (!(Game.getObjectById(memTarget.container))) {
        memTarget.container = null;
        // Since the container is dead, need to build another one
        return this.buildContainer(target, range, memTarget, defaultParams);
      }
    }
    return memTarget
  }
  updateConstructionSites() {
    const updateSites = this._updateSites;
    let allSites = this.base.constructionSites;
    // We need to get ids for every site that doesn't have one
    // Run through them all and if you do have an id, put it in memory
    updateSites.forEach((site, i, obj) => {
      const construction = _.find(Game.constructionSites, (s) => {
        return s.pos.x === site.x && s.pos.y === site.y;
      });
      if (construction !== null) {
        let replacement = site;
        replacement.id = construction.id;
        allSites.push(replacement);
        // Remove the item out of the buffer
        obj.splice(i, 1);
      }
    });
    // Update memory with processed array
    this.base.constructionSites = allSites;
    this._updateSites = updateSites;
  }
  scan() {
    // See if there's construction sites to update
    this.updateConstructionSites();
    if (this.scanned === null || (this.scanned + 300 < Game.time)) {
      const terrain = this.room.getTerrain();
      const sources = this.room.find(FIND_SOURCES);
      let sourceOutput = this.sources;
      for (const source of sources) {
        let memSource = sourceOutput[source.id];
        const freeSpaces = this.findFreeSpaces(terrain, source, 1);
        const params = {
          freeSpaces: freeSpaces.length,
          harvesters: [],
          room: room.name,
          container: null,
          _pos: null
        };
        memSource = this.buildContainer(source, room, 1, memSource, params);
      }
      // Store back into memory
      this.sources = sourceOutput;

      // if (controller.my) {
      //   let memController = Memory.controllers[controller.id];
      //   const params = {
      //     upgraders: [],
      //     room: this.name,
      //     container: null,
      //     _pos: null
      //   }
      //   memController = this.buildContainer(controller, room, 3, memController, params);
      //   // Store back into memory
      //   Memory.controllers[controller.id] = memController;
      // }
      roomMemory.scanned = Game.time;
    }
  }
}
