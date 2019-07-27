import './prototypes';
import BaseManager from './managers/base';

export const loop = () => {
  if (!Memory.bases) {
    Memory.bases = {}
    BaseManager.newBase('base1', Object.values(Game.rooms)[0])
  }
  for (name in Memory.bases) {
    console.log(name);
    const base = new BaseManager(name);
    base.run();
  }
}
