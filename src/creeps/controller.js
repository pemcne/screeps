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
  checkBuilds() {
    const workers = _.filter(Game.creeps, creep => creep.memory.role === 'worker');
    const sites = Memory.constructionSites;
    console.log(sites);
    sites.forEach((s) => {
      const construction = Game.getObjectById(s.id);
      if (s.numWorkers === undefined) {
        // Assume that each worker will contribute 1000
        s.numWorkers = construction.progressTotal / 1000;
      }
      const numWorkers = s.numWorkers;
      if (s.workers.length < numWorkers) {
        const diff = numWorkers - s.workers.length;
        const freeWorkers = _.filter(workers, {
          filter: (worker) => worker.available
        });
        if (freeWorkers.length == 0) {
          // Try and spawn new workers
        } else {
          const builders = construction.pos.findClosestNByPath(freeWorkers, diff);
          builders.forEach((b) => {
            const action = {
              type: 'build',
              data: {
                target: s.id
              }
            }
            b.addAction(action);
            b.available = false;
          });
        }
      }
    });
  }
  run() {
    // Need to clean
    if (Game.time % 100 === 0) {
      this.clean();
    }
    const spawn = Game.spawns.Spawn1;
    const roomName = Object.keys(Game.rooms)[0];
    const room = Game.rooms[roomName];
    let spawning = false;
    // Assign workers to construction sites
    // this.checkBuilds();
    // Run through all creeps
    for (const role of RolePriority) {
      const creeps = _.filter(Game.creeps, creep => creep.memory.role === role);
      const roleConfig = RoleMap[role];
      if (creeps.length < roleConfig.minNumber && !spawning) {
        this.spawn(spawn, role, roleConfig.baseBody);
        // Since the last one is what actually spawns, have to block once we start
        spawning = true;
      }
      const classObj = roleConfig.cls;
      creeps.forEach(creep => {
        if (creep.spawning) {
          // Skip since we are spawning
          return;
        }
        const c = new classObj(creep);
        if (c.actions.length === 0) {
          creep.memory.actions = classObj.getInitialActions(room);
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
