import CreepController from './creeps/controller';
import './utils/pathing';
import RoomPlanner from './roomPlanner';

export const loop = () => {
  const sources = Game.rooms.sim.find(FIND_SOURCES);
  const closest2 = Game.spawns.Spawn1.pos.findClosestNByPath(sources, 2);
  closest2.forEach((i, index) => {
    console.log('source', index, i.id);
  });
  // RoomPlanner.scan();
  // CreepController.run();

  // if (Game.spawns.Spawn1.spawning) {
    // const spawningCreep = Game.spawns.Spawn1.spawning.name;
    // console.log(`Spawning ${spawningCreep}`);
  // }
}
