import { RoleMap, RolePriority } from '../creeps/rolemap';

class CreepManager {
  constructor(base) {
    this.base = base;
    // Load all of the creeps
    this.loadCreeps(base.creeps);
  }
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
    const workers = _.filter(this.creeps, creep => creep.role === 'worker');
    console.log('creep', this.creeps[0]);
    console.log('worker', workers[0]);
    const constructionSites = this.base.constructionSites;
    constructionSites.forEach((construction) => {
      console.log('found construction', construction.id);
      if (site.numWorkers === undefined) {
        // Assume that each worker will contribute 1000
        site.numWorkers = construction.progressTotal / 2500;
      }
      const numWorkers = site.numWorkers;
      console.log('workers needed', numWorkers, site.workers.length);
      if (site.workers.length < numWorkers) {
        const diff = numWorkers - site.workers.length;
        const freeWorkers = _.filter(workers, (worker) => worker.available);
        console.log('found workers to use', freeWorkers);
        if (freeWorkers.length !== 0) {
          const builders = construction.pos.findClosestNByPath(freeWorkers, diff);
          builders.forEach((b) => {
            const action = {
              type: 'build',
              data: {
                target: site.id
              }
            }
            b.addAction(action);
            b.available = false;
          });
        }
      }
    });
  }
  loadCreeps(creeps) {
    this.creeps = [];
    for (creep of creeps) {
      const role = creep.memory.role;
      const roleConfig = RoleMap[role];
      this.creeps.push(new roleConfig.cls(creep));
    }
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
    this.checkBuilds();
    // Run through all creeps
    for (const role of RolePriority) {
      const creeps = _.filter(this.creeps, creep => creep.role === role);
      const roleConfig = RoleMap[role];
      if (creeps.length < roleConfig.minNumber && !spawning) {
        this.spawn(spawn, role, roleConfig.baseBody);
        // Since the last one is what actually spawns, have to block once we start
        spawning = true;
      }
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

export default CreepManager;
