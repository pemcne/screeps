import ConstructionRequest from "requests/ConstructionRequest";
import BaseManager from "./BaseManager";

export default class RoomManager {
  private base: BaseManager;
  constructor(base: BaseManager) {
    this.base = base;
  }
  scanEdge(xPerm: number[], yPerm: number[], sX: number, sY: number, roomName: string) {
    let output = [];
    for (const x of xPerm) {
      const tX = sX + x;
      for (const y of yPerm) {
        const tY = sY + y;
        if (tX === sX && tY === sY) {
          continue;
        }
        output.push(new RoomPosition(tX, tY, roomName));
      }
    }
    return output;
  }
  generateRangeCoordinates(start: number, end: number) {
    // Given -5 and 5, this will generate an array of [-5, -4, ... 4, 5]
    return Array.from({ length: end - start + 1 }, (v, k) => k + start);
  }
  getAllAdjacent(source: RoomPosition, roomName: string, range: number) {
    const sX = source.x;
    const sY = source.y;
    const rangeMin = Math.abs(range) * -1;
    const rangeMax = Math.abs(range);
    const perm = this.generateRangeCoordinates(rangeMin, rangeMax);
    const permEdge = [rangeMin, rangeMax];
    const permShort = _.xor(perm, permEdge);
    const edgeX = this.scanEdge(perm, permEdge, sX, sY, roomName);
    const edgeY = this.scanEdge(permEdge, permShort, sX, sY, roomName);
    return [...edgeX, ...edgeY];
  }
  chooseContainer(roomName: string, source: RoomPosition, range: number) {
    // This does a really basic lookup and chooses the closest of the
    // spots to the closest spawn, should be "good enough" for a container
    // First find the closest spawn
    source.findClosestByPath;
    const opts = {
      ignoreCreeps: true
    } as FindPathOpts;
    const spawn = source.findClosestByPath(FIND_MY_SPAWNS, {
      ignoreCreeps: true,
      filter: {}
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
    new RoomVisual(roomName).circle(spot.x, spot.y, { opacity: 1, fill: "#ff0000" });
    return spot;
  }
  findFreeSpaces(roomName: string, source: Source, terrain: RoomTerrain, range = 1) {
    const pos = source.pos;
    const adjacent = this.getAllAdjacent(pos, roomName, range);
    let freeSpaces = [];
    for (const adj of adjacent) {
      const terrainType = terrain.get(adj.x, adj.y);
      if (terrainType !== TERRAIN_MASK_WALL) {
        freeSpaces.push(adj);
        new RoomVisual(roomName).circle(adj.x, adj.y, { opacity: 1 });
      }
    }
    return freeSpaces;
  }
  buildContainer(target: Source, roomName: string, range: number) {
    const container = this.chooseContainer(roomName, target.pos, range);
    const constructRequest = new ConstructionRequest(this.base.name, STRUCTURE_CONTAINER);
    constructRequest.data = {
      x: container?.x,
      y: container?.y
    };
    this.base.constructionRequests.push(constructRequest);
  }
  scan(room: Room) {
    const scanThreshold = 300;
    if (room.scanned === undefined || room.scanned + scanThreshold < Game.time) {
      const controller = room.controller;
      if (controller === undefined) {
        // Should this ever happen??
        throw new Error(`Undefined controller in room: ${room.name}`);
      }
      const controllerRCL = controller.my ? controller.level : null;
      const terrain = room.getTerrain();
      let sources: (Source | null)[];
      if (room.sources === undefined) {
        sources = room.find(FIND_SOURCES);
        room.sources = sources;
      } else {
        // Remove any null values if there are some...
        sources = room.sources;
      }
      sources.forEach((source) => {
        if (source === null) {
          return;
        }
        if (source.numFreeSpaces === -1) {
          const freeSpaces = this.findFreeSpaces(room.name, source, terrain, 1);
          source.numFreeSpaces = freeSpaces.length;
        }
        this.buildContainer(source, room.name, 1);
      });
      room.scanned = Game.time;
    } else {
    }
  }
  init() {}
  run() {
    this.base.rooms.forEach((room) => {
      this.scan(room);
    });
  }
}
