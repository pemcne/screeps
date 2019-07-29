class RoomManager {
  constructor(base, room) {
    this.base = base;
    this.room = room;
    this.name = room.name;
    if (!(room.name in Memory.rooms)) {
      Memory.rooms[room.name] = {
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
  get scanned() {
    return Memory.rooms[this.name].scanned;
  }
  set scanned(time) {
    Memory.rooms[this.name].scanned = time;
  }
  generateRangeCoordinates(start, end) {
    // Given -5 and 5, this will generate an array of [-5, -4, ... 4, 5]
    return Array.from({ length: (end - start + 1) }, (v, k) => k + start);
  }
  scanEdge(xPerm, yPerm, sX, sY, room) {
    let output = [];
    for (const x of xPerm) {
      const tX = sX + x;
      for (const y of yPerm) {
        const tY = sY + y;
        if (tX === sX && tY === sY) {
          continue;
        }
        output.push(new RoomPosition(tX, tY, room));
      }
    }
    return output
  }
  getAllAdjacent(source, room, range) {
    const sX = source.x;
    const sY = source.y;
    const rangeMin = Math.abs(range) * -1;
    const rangeMax = Math.abs(range);
    const perm = this.generateRangeCoordinates(rangeMin, rangeMax);
    const permEdge = [rangeMin, rangeMax];
    const permShort = _.xor(perm, permEdge);
    const edgeX = this.scanEdge(perm, permEdge, sX, sY, room);
    const edgeY = this.scanEdge(permEdge, permShort, sX, sY, room);
    return [...edgeX, ...edgeY];
  }
  chooseContainer(room, source, range) {
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
    const path = PathFinder.search(spawn.pos, goal, {heuristicWeight: 2});
    const spot = path.path[path.path.length - range];
    new RoomVisual(room.name).circle(spot.x, spot.y, { opacity: 1, fill: '#ff0000' });
    return spot;
  }
  findFreeSpaces(terrain, room, source, range = 1) {
    const pos = source.pos;
    const adjacent = this.getAllAdjacent(pos, room, range);
    let freeSpaces = [];
    for (const adj of adjacent) {
      const terrainType = terrain.get(adj.x, adj.y);
      if (terrainType !== TERRAIN_MASK_WALL) {
        freeSpaces.push(adj);
        new RoomVisual(room).circle(adj.x, adj.y, { opacity: 1 });
      }
    }
    return freeSpaces;
  }
  canBuild(room, structure, rcl) {
    // Pulls the structure from CONTROLLER_STRUCTURES
    // Compares against built structures and returns boolean
    if (!(rcl in CONTROLLER_STRUCTURES[structure])) {
      return ERR_NOT_FOUND;
    }
    const avail = CONTROLLER_STRUCTURES[structure][rcl];
    const built = room.find(FIND_STRUCTURES, {
      filter: s => s.structureType === structure
    });
    return built.length < avail;
  }
  findAt(room, pos, type) {
    const sites = room.lookForAt(LOOK_STRUCTURES, pos);
    sites.forEach((i) => {
      console.log(i.type, i.id);
      if (i.type ===  type) {
        return i.id;
      }
    });
  }
  buildComplete(siteId) {
    _.remove(Memory.constructionSites, (s) => s.id === siteId);
  }
  build(room, pos, structure) {
    // Returns the id of the construction site if successful
    // Returns null otherwise
    if (this.canBuild(room, structure, room.controller.level)) {
      const resp = room.createConstructionSite(pos.x, pos.y, structure);
      if (!resp) {
        // Build succeeded
        const site = {
          x: pos.x,
          y: pos.y,
          type: structure,
          room: room.name,
          id: null,
          workers: []
        };
        Memory.rooms[this.name]._updateSites.push(site);
      }
      return resp;
    }
    return null;
  }
  buildContainer(target, room, range, memTarget, defaultParams) {
    if (memTarget === undefined) {
      memTarget = defaultParams;
    }
    if (memTarget.container === null && memTarget._pos === null) {
      // Build was unsuccessful last time
      const container = this.chooseContainer(room, target.pos, range);
      const resp = this.build(room, container, STRUCTURE_CONTAINER);
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
        return this.buildContainer(target, room, range, memTarget, defaultParams);
      }
    }
    return memTarget
  }

  updateConstructionSites() {
    const updateSites = Memory.rooms[this.name]._updateSites;
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
    Memory.rooms[this.name]._updateSites = updateSites;
  }

  scan() {
    // See if there's construction sites to update
    this.updateConstructionSites();
    const room = this.room;
    if (this.scanned === null || (this.scanned + 300 < Game.time)) {
      const controller = room.controller;
      const controllerRCL = controller.my ? controller.level : null;
      const terrain = room.getTerrain();
      const sources = room.find(FIND_SOURCES);
      let sourceOutput = this.sources;
      for (const source of sources) {
        let memSource = sourceOutput[source.id];
        const freeSpaces = this.findFreeSpaces(terrain, room.name, source, 1);
        const params = {
          freeSpaces: freeSpaces.length,
          harvesters: [],
          room: this.name,
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
      Memory.rooms[this.name].scanned = Game.time;
    }
  }
}

export default RoomManager;
