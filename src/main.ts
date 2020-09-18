import "./prototypes";
import BaseManager from "managers/BaseManager";
import { initMemory } from "utils";

export const loop = () => {
  initMemory();
  if (Object.keys(Memory.bases).length === 0) {
    BaseManager.newBase("base1", Object.keys(Game.rooms)[0] as Id<Room>);
  }
  for (let name in Memory.bases) {
    const base = new BaseManager(name);
    base.run();
  }
};
