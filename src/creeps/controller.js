import { RoleMap, RolePriority } from './rolemap';

class CreepController {
  clean() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  }
  generateName(role) {
    return `${role}-${Game.time}`;
  }
  run() {
    // Need to clean
    if (Game.time % 100 === 0) {
      this.clean();
    }
    const spawn = Game.spawns.Spawn1;
    const roomName = Object.keys(Game.rooms)[0];
    const room = Game.rooms[roomName];
    // Run through all creeps
    for (const role of RolePriority) {
      const creeps = _.filter(Game.creeps, creep => creep.memory.role === role);
      const roleConfig = RoleMap[role];
      if (creeps.length < roleConfig.minNumber) {
        this.spawn(spawn, role, roleConfig.baseBody);
      }
      const classObj = roleConfig.cls;
      creeps.forEach(creep => {
        if (creep.spawning) {
          // Skip since we are spawning
          return;
        }
        const c = new classObj(creep);
        if (c.actions.length === 0) {
          creep.memory.actions = classObj.getInitialActions();
          c.loadActions();
        }
        c.run();
      })
    }
  }
  spawn(spawn, role, body) {
    const name = this.generateName(role);
    const resp = spawn.createCreep(body, name, { role: role });
    return resp;
  }
}

export default new CreepController();
