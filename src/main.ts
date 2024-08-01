import "./prototypes";
import BaseManager from "managers/BaseManager";
import { initMemory } from "utils";
import { RoleType } from "creeps";

export const loop = () => {
  console.log("Memory", RoleType.worker);
  initMemory();
  console.log("done with memory");
  if (Object.keys(Memory.bases).length === 0) {
    BaseManager.newBase("base1", Object.keys(Game.rooms)[0]);
  }
  for (let name in Memory.bases) {
    const base = new BaseManager(name);
    base.run();
  }
};
