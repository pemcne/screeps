export let creeps: Creep[];
export let creepCount: number = 0;

export const run = (): void => {
  // Automatically delete memory of missing creeps
  if (Game.time % 100 === 0) {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }
  const spawn = Game.spawns["Spawn1"];
  const roomName = Object.keys(Game.rooms)[0];
  const room = Game.rooms[roomName];
  const energyCapacity = room.energyCapacityAvailable;
  loadCreeps(room);

  // Spawn all missing creeps
  creeps.forEach(creep => {
    console.log(creep.memory.role);
  });
};

const loadCreeps = (room: Room): void => {
  creeps = room.find<FIND_MY_CREEPS>(FIND_MY_CREEPS);
  creepCount = _.size(creeps);
};
