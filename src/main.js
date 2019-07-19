import CreepController from './creeps/controller';
import './prototypes';
import RoomPlanner from './roomPlanner';

export const loop = () => {
  RoomPlanner.scan();
  CreepController.run();

  if (Game.spawns.Spawn1.spawning) {
    const spawningCreep = Game.spawns.Spawn1.spawning.name;
    console.log(`Spawning ${spawningCreep}`);
  }
}
