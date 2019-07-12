class RoomPlanner {
  constructor() {
    if (!Memory.sources) {
      Memory.sources = {};
    }
    if (!Memory.controllers) {
      Memory.controllers = {};
    }
  }
  generateRangeCoordinates(start, end) {
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
    const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, pos);
    sites.forEach((i) => {
      console.log(i.type, i.id);
      if (i.type ===  LOOK_CONSTRUCTION_SITES) {
        console.log('found construction', i.id);
        return i.id;
      }
    });
  }
  build(room, pos, structure) {
    // Returns the id of the construction site if successful
    // Returns null otherwise
    if (this.canBuild(room, structure, room.controller.level)) {
      return room.createConstructionSite(pos.x, pos.y, structure);
    }
    return null;
  }
  buildContainer(target, room, range, memTarget, memKey, defaultParams) {
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
          y: container.y
        }
        Memory.construction.push({
          pos: {
            x: container.x,
            y: container.y
          },
          key: memKey,
          id: null
        })
      }
    } else if (memTarget.container === null && memTarget._pos !== null) {
      // Construction in progress, check on it
      const buildSite = memTarget._pos;
      const site = Game.getObjectById(buildSite.id);
      if (site === null) {
        // Construction complete
        const spots = room.lookForAt(LOOK_STRUCTURES, buildSite.x, buildSite.y);
        // Since you are looking for a single building at a single spot, assume it's first
        const siteBuilding = _.filter(spots, (s) => s.structureType === buildSite.type);
        if (siteBuilding.length > 0) {
          memTarget.container = siteBuilding[0].id;
          memTarget._pos = null;
        }
      }
    } else if (memTarget.container) {
      // Just check if it's valid
      if (!(Game.getObjectById(memTarget.container))) {
        memTarget.container = null;
      }
    }
    return memTarget
  }
  scan() {
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      const controller = room.controller;
      const controllerRCL = controller.my ? controller.level : null;
      const terrain = room.getTerrain();
      const sources = room.find(FIND_SOURCES);
      for (const source of sources) {
        let memSource = Memory.sources[source.id];
        const freeSpaces = this.findFreeSpaces(terrain, room.name, source, 1);
        const params = {
          freeSpaces: freeSpaces.length,
          harvesters: [],
          room: roomName,
          container: null,
          _pos: null
        };
        key = `sources.${source.id}.container`
        memSource = this.buildContainer(source, room, terrain, 1, memSource, key, params);
        // Store back into memory
        Memory.sources[source.id] = memSource;
      }
      if (controller.my) {
        let memController = Memory.controllers[controller.id];
        const params = {
          upgraders: [],
          room: roomName,
          container: null,
          _pos: null
        }
        memController = this.buildContainer(controller, room, terrain, 3, memController, params);
        // Store back into memory
        Memory.controllers[controller.id] = memController;
      }
    }
  }
}

export default new RoomPlanner();
