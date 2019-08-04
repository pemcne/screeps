import './prototypes';
import BaseManager from './managers/base';

const init = () => {
  if (!Memory.scratch) {
    Memory.scratch = {};
  }
}

export const loop = () => {
  init();
  if (!Memory.bases) {
    Memory.bases = {}
    BaseManager.newBase('base1', Object.values(Game.rooms)[0])
  }
  for (name in Memory.bases) {
    const base = new BaseManager(name);
    base.run();
  }
}
