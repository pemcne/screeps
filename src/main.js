import './prototypes';
import BaseManager from './managers/base';

export const loop = () => {
  if (!Memory.bases) {
    Memory.bases = {};
    const base = new BaseManager('Base1');
  } else {
    for (name in Memory.bases) {
      const base = new BaseManager(name);
    }
  }
  // RoomPlanner.scan();
  // CreepController.run();

  // if (Game.spawns.Spawn1.spawning) {
  //   const spawningCreep = Game.spawns.Spawn1.spawning.name;
  //   console.log(`Spawning ${spawningCreep}`);
  // }
}
