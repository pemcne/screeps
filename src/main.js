import './prototypes';
import BaseManager from './managers/base';

export const loop = () => {
  if (!Memory.bases) {
    Memory.bases = {}
  }
  for (name in Memory.bases) {
    console.log(name);
    const base = new BaseManager(name);
    base.run();
  }
  // RoomPlanner.scan();
  // CreepController.run();

  // if (Game.spawns.Spawn1.spawning) {
  //   const spawningCreep = Game.spawns.Spawn1.spawning.name;
  //   console.log(`Spawning ${spawningCreep}`);
  // }
}
