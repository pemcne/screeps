import BaseManager from "./BaseManager";
import Harvester from "creeps/roles/Harvester";
import { RoleMap } from "creeps/roles/Role";

export default class CreepManager {
  private base: BaseManager;
  private creeps: CreepRole[] = [];
  private creepRoles: { [name: string]: CreepRole[] } = {};
  // private freeWorkers: BaseCreep[] = [];
  private rolePriority: RoleType[] = [RoleType.harvester];
  constructor(base: BaseManager) {
    this.base = base;
    this.loadCreeps();
  }
  private clean() {
    for (const name of Object.keys(Memory.creeps)) {
      if (Game.creeps[name] === undefined) {
        delete Memory.creeps[name];
        delete this.base.creeps[name];
      }
    }
  }
  private generateName(role: string): string {
    return `${role}-${Game.time}`;
  }
  private loadCreepRole(role: RoleType, creep: Creep): CreepRole {
    switch (role) {
      case RoleType.harvester:
        return new Harvester(creep, this);
      default:
        throw new Error(`Unknown role type: ${role}`);
    }
  }
  private loadCreeps() {
    let cleaned = false;
    Object.values(this.base.creeps).forEach((creep) => {
      if (creep === null) {
        if (!cleaned) {
          cleaned = true;
          this.clean();
        }
        return;
      }
      const role = creep.memory.role as RoleType;
      const creepObj = this.loadCreepRole(role, creep);
      this.creeps.push(creepObj);
      if (!(role in this.creepRoles)) {
        this.creepRoles[role] = [];
      }
      this.creepRoles[role].push(creepObj);
      // if (role === 'worker' && creepObject.available) {
      //   this.freeWorkers.push(creepObject);
      // }
    });
  }
  private spawn(spawn: StructureSpawn, role: RoleType, body: BodyPartConstant[]) {
    const name = this.generateName(role);
    const options: SpawnOptions = {
      memory: {
        role: role,
        actions: []
      }
    };
    const resp = spawn.spawnCreep(body, name, options);
    if (resp === OK) {
      // Save the creep to the base memory
      this.base.creeps[name] = null;
    }
    return resp;
  }
  run() {
    const spawn = Game.spawns.Spawn1;
    const roomName = Object.keys(Game.rooms)[0];
    const room = Game.rooms[roomName];
    let spawning = spawn.spawning !== null;

    //this.assignWorkers();
    for (const role of this.rolePriority) {
      let creeps = this.creepRoles[role];
      if (creeps === undefined) {
        creeps = [];
      }
      const roleConfig = RoleMap.get(role);
      if (roleConfig === undefined) {
        throw new Error(`Can't load role config, unknown role: ${role}`);
      }
      if (creeps.length < roleConfig.minNumber && !spawning) {
        if (spawn.store.getCapacity(RESOURCE_ENERGY) >= 300) {
          this.spawn(spawn, role, roleConfig.baseBody);
          spawning = true;
        }
      }
      creeps.forEach((creep) => {
        if (creep.creep.spawning) {
          return;
        }
        if (creep.actions.length === 0) {
          // Get the initial actions
          creep.creep.memory.actions = roleConfig.getInitialActions(room);
          creep.loadActions();
        }
        creep.run();
      });
    }
  }
}
