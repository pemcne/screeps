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
  chooseContainer(room, spots, source) {
    // This does a really basic lookup and chooses the closest of the
    // spots to the closest spawn, should be "good enough" for a container
    // First find the closest spawn
    const spawn = source.findClosestByPath(FIND_MY_SPAWNS);
    // const path = room.findPath(spawn.pos, source, {
    //   range: 1,
    //   ignoreCreeps: true
    // });
    // path.forEach((p) => {
    //   new RoomVisual(room.name).circle(p.x, p.y, { fill: '#00ff00'});
    // });
    if (spawn === null) {
      // This really shouldn't happen...
      return null;
    }
    const spot = spawn.pos.findClosestByPath(spots, { algorithm: 'dijkstra' });
    new RoomVisual(spot.roomName).circle(spot.x, spot.y, { opacity: 1, fill: '#ff0000' });
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
      return room.createConstructionSite(pos, structure);
    }
    return null;
  }
  scan() {
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      const controller = room.controller;
      const controllerRCL = controller.my ? controller.level : null;
      const terrain = room.getTerrain();
      const sources = room.find(FIND_SOURCES);
      for (const source of sources) {
        const freeSpaces = this.findFreeSpaces(terrain, room.name, source, 1);
        let memSource = Memory.sources[source.id];
        if (memSource === undefined) {
          let params = {
            numHarvesters: freeSpaces.length,
            harvesters: [],
            room: roomName,
            container: null,
            _build: null
          };
          memSource = params;
        }
        if (memSource.container === null && memSource._build === null) {
          // Build was unsuccessful last time
          const container = this.chooseContainer(room, freeSpaces, source.pos);
          const resp = this.build(room, container, STRUCTURE_CONTAINER);
          console.log('resp build', resp);
          if (!resp) {
            memSource._build = {
              type: STRUCTURE_CONTAINER,
              x: container.x,
              y: container.y
            }
          }
        } else if (memSource.container === null && memSource._build !== null) {
          // Construction in progress, check on it
          const buildSite = memSource._build;
          const site = Game.getObjectById(buildSite.id);
          if (site === null) {
            // Construction complete
            const spots = room.lookForAt(LOOK_STRUCTURES, buildSite.x, buildSite.y);
            // Since you are looking for a single building at a single spot, assume it's first
            const siteBuilding = _.filter(spots, (s) => s.structureType === buildSite.type);
            if (siteBuilding.length > 0) {
              memSource.container = siteBuilding[0].id;
              console.log('build complete', memSource.container);
              memSource._build = null;
            }
          }
        } else if (memSource.container) {
          // Just check if it's valid
          if (!(Game.getObjectById(memSource.container))) {
            memSource.container = null;
          }
        }
        // Store back into memory
        Memory.sources[source.id] = memSource;
      }
      // if (controller.my) {
      //   if (!(controller.id in Memory.controllers)) {
      //     const freeSpaces = this.findFreeSpaces(terrain, room.name, controller, 3);
      //     const container = this.chooseContainer(room, freeSpaces, controller.pos);
      //     Memory.controllers[controller.id] = {
      //       numUpgraders: freeSpaces.length,
      //       upgraders: [],
      //       room: roomName,
      //       container: null
      //     };
      //   }
      // }
    }
  }
}

export default new RoomPlanner();
