class RoomManager {
  constructor(base) {
    this.base = base;
    if (!Memory.scratch._updateSites) {
      Memory.scratch._updateSites = [];
    }
    if (!Memory.scratch.containerCache) {
      Memory.scratch.containerCache = {};
    }
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
  findFreeSpaces(room, source, terrain, range = 1) {
    const pos = source.pos;
    const adjacent = this.getAllAdjacent(pos, room.name, range);
    let freeSpaces = [];
    for (const adj of adjacent) {
      const terrainType = terrain.get(adj.x, adj.y);
      if (terrainType !== TERRAIN_MASK_WALL) {
        freeSpaces.push(adj);
        new RoomVisual(room.name).circle(adj.x, adj.y, { opacity: 1 });
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
  build(room, pos, structure, reference) {
    // Returns the id of the construction site if successful
    // Returns null otherwise
    if (this.canBuild(room, structure, room.controller.level)) {
      const resp = room.createConstructionSite(pos.x, pos.y, structure);
      if (!resp) {
        // Build succeeded
        const site = {
          x: pos.x,
          y: pos.y,
          reference: reference
        };
        Memory.scratch._updateSites.push(site);
      }
      return resp;
    }
    return null;
  }
  buildContainer(target, room, range) {
    // See if this is the first time building a container
    if (Memory.scratch.containerCache[target.id] === undefined) {
      const container = this.chooseContainer(room, target.pos, range);
      this.build(room, container, STRUCTURE_CONTAINER, target.id);
      // Put null in here as a placeholder to know that we started
      Memory.scratch.containerCache[target.id] = null;
    }
  }

  updateConstructionSites() {
    const updateSites = Memory.scratch._updateSites;
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
        // Update the containerCache with the id so we know it's in progress
        // TODO: implement a clean function to clean up containerCache
        Memory.scratch.containerCache[site.reference] = construction.id
      }
    });
    // Update memory with processed array
    this.base.constructionSites = allSites;
    Memory.scratch._updateSites = updateSites;
  }

  scan(room) {
    // See if there's construction sites to update
    this.updateConstructionSites();
    if (room.scanned === null || (room.scanned + 300 < Game.time)) {
      const controller = room.controller;
      const controllerRCL = controller.my ? controller.level : null;
      const terrain = room.getTerrain();
      const sources = room.sources;
      sources.forEach((source) => {
        if (!source.numFreeSpaces) {
          const freeSpaces = this.findFreeSpaces(room, source, terrain, 1);
          source.numFreeSpaces = freeSpaces.length;
        }
        if (!source.container) {
          this.buildContainer(source, room, 1)
        }
      })

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
      room.scanned = Game.time;
    }
  }
  run() {
    const rooms = this.base.rooms;
    rooms.forEach((room) => {
      this.scan(room);
    });
  }
}

export default RoomManager;
