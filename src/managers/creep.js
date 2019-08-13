import { RoleMap, RolePriority } from '../creeps/rolemap';

class CreepManager {
  constructor(base) {
    this.base = base;
    // Load all of the creeps
    this.loadCreeps(base.creeps);
  }
  clean() {
    for (const name of Object.keys(Memory.creeps)) {
      console.log(name);
      if (!Game.creeps[name]) {
        console.log('cleaning up', name);
        // Need to delete
        for (const [id, site] of Object.entries(Memory.constructionSites)) {
          if (site.workers && site.workers.includes(name)) {
            Memory.constructionSites[id].workers = _.without(site.workers, name);
          }
        }
        delete Memory.creeps[name];
        this.base.creeps = _.without(this.base.creeps, undefined);
      }
    }
  }
  generateName(role) {
    return `${role}-${Game.time}`;
  }
  actionComplete(action) {
    if (action.type === 'build') {
      const site = action.data.target;
      delete Memory.constructionSites[site];
      for (const [key, value] of Object.entries(Memory.scratch.containerCache)) {
        if (value === site) {
          const target = Game.getObjectById(key);
          target.container = site;
          delete Memory.scratch.containerCache[key];
          break;
        }
      }
      delete Memory.constructionSites[site];
    }
  }
  assignWorkers() {
    this.base.controllers.forEach((controller) => {
      if (controller.ticksToDowngrade < (controller.progressTotal * 0.33)) {
        // Need to do an emergency upgrade
        let worker = null;
        if (this.freeWorkers.length > 0) {
          worker = controller.pos.findClosestNByPath(this.freeWorkers, 1);
        } else if (this.workers.length > 0) {
          worker = controller.pos.findClosestNByPath(this.workers, 1);
        }
        if (!worker) {
          console.log('WRNING: no worker to upgrade controller', controller.id);
          return
        }
        const action = {
          type: 'upgrade',
          data: {
            target: controller.id,
            count: 100
          }
        };
        worker.assignTask(action);
      }
    });
    this.checkBuilds();
  }
  checkBuilds() {
    const constructionSites = this.base.constructionSites;
    constructionSites.forEach((site) => {
      if (site === null) {
        // We just completed it so skip it here for now
        return
      }
      const numWorkers = site.numWorkers;
      if (site.workers.length < numWorkers) {
        let siteWorkers = site.workers;
        const diff = numWorkers - siteWorkers.length;
        if (this.freeWorkers.length !== 0) {
          const builders = site.pos.findClosestNByPath(this.freeWorkers, diff);
          builders.forEach((b) => {
            const action = {
              type: 'build',
              data: {
                target: site.id
              }
            }
            b.assignTask(action);
            siteWorkers.push(b.creep);
            // Save the workers for later
            site.workers = siteWorkers;
            _.remove(this.freeWorkers, c => c.name === b.name);
          });
        }
      }
    });
  }
  loadCreeps(creeps) {
    this.creeps = [];
    this.creepRoles = {};
    this.freeWorkers = [];
    creeps.forEach((creep) => {
      // Just in case the creep doesn't exist...
      if (!creep) {
        this.clean();
        return;
      }
      const role = creep.memory.role;
      const roleConfig = RoleMap[role];
      const creepObject = new roleConfig.cls(creep, this);
      this.creeps.push(creepObject);
      if (!(role in this.creepRoles)) {
        this.creepRoles[role] = [];
      }
      this.creepRoles[role].push(creepObject)
      if (role === 'worker' && creepObject.available) {
        this.freeWorkers.push(creepObject);
      }
    });
  }
  run() {
    const spawn = Game.spawns.Spawn1;
    const roomName = Object.keys(Game.rooms)[0];
    const room = Game.rooms[roomName];
    let spawning = spawn.spawning;
    // Assign workers to construction sites
    this.assignWorkers();
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
        if (creep.creep.spawning) {
          // Skip since we are spawning
          return;
        }
        if (creep.actions.length === 0) {
          creep.creep.memory.actions = roleConfig.cls.getInitialActions(room);
          creep.loadActions();
        }
        creep.run();
      });
    }
  }
  spawn(spawn, role, body) {
    const name = this.generateName(role);
    const memory = {
      role: role
    };
    const resp = spawn.spawnCreep(body, name, { memory: memory });
    if (resp === OK) {
      this.base.addCreep(name);
    }
    return resp;
  }
}

export default CreepManager;
