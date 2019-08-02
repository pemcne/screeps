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
    constructionSites.forEach((site) => {
      console.log('found construction', site.id);
      // TODO pull in the actual construction site and use the prototype
      const numWorkers = site.numWorkers;
      console.log('workers needed', numWorkers, site.workers.length);
      if (site.workers.length < numWorkers) {
        const diff = numWorkers - site.workers.length;
        const freeWorkers = _.filter(workers, (worker) => worker.available);
        console.log('found workers to use', freeWorkers);
        if (freeWorkers.length !== 0) {
          const builders = site.pos.findClosestNByPath(freeWorkers, diff);
          builders.forEach((b) => {
            console.log(b);
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
    creeps.forEach((creep) => {
      console.log('loading', creep);
      const role = creep.memory.role;
      const roleConfig = RoleMap[role];
      this.creeps.push(new roleConfig.cls(creep));
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
        console.log('creep test', creep);
        if (creep.actions.length === 0) {
          creep.creep.memory.actions = classObj.getInitialActions(room);
          creep.loadActions();
        }
        creep.run();
      })
    }
  }
  spawn(spawn, role, body) {
    const name = this.generateName(role);
    const memory = {
      role: role
    };
    const resp = spawn.spawnCreep(body, name, { memory: memory });
    this.base.addCreep(name);
    return resp;
  }
}

export default CreepManager;
