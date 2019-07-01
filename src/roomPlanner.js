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
  chooseContainer(spots, source) {
    // This does a really basic lookup and chooses the closest of the
    // spots to the closest spawn, should be "good enough" for a container
    // First find the closest spawn
    const spawn = source.findClosestByPath(FIND_MY_SPAWNS);
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
  scan() {
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      const controller = room.controller;
      const controllerRCL = controller.my ? controller.level : null;
      const terrain = room.getTerrain();
      const sources = room.find(FIND_SOURCES);
      for (const source of sources) {
        if (!(source.id in Memory.sources)) {
          const freeSpaces = this.findFreeSpaces(terrain, room.name, source, 1);
          console.log(source.id, freeSpaces);
          const container = this.chooseContainer(freeSpaces, source.pos);
          Memory.sources[source.id] = {
            numHarvesters: freeSpaces.length,
            harvesters: [],
            room: roomName,
            container: null
          };
        }
      }
      if (!(controller.id in Memory.controllers)) {
        if (controller.my) {
          const freeSpaces = this.findFreeSpaces(terrain, room.name, controller, 3);
          const container = this.chooseContainer(freeSpaces, controller.pos);
          Memory.controllers[controller.id] = {
            numUpgraders: freeSpaces.length,
            upgraders: [],
            room: roomName,
            container: null
          };
        }
      }
    }
  }
}

export default new RoomPlanner();
