import { Role, RoleMap } from "./roles/roles";
import { Harvester } from "./roles/harvester";

// let creeps: Creep[];
// let creepCount: number = 0;

const clean = () => {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
};
const generateName = (role: string): string => `${role}-${Game.time}`;

const spawnCreep = (spawn: StructureSpawn, role: Role, roleName: string, body: BodyPartConstant[]): number => {
  const newName = `${roleName}-${Game.time}`;
  const resp = spawn.createCreep(body, newName, { role: role });
  if (typeof resp === "string") {
    return OK;
  }
  return resp;
};

const count = (role: Role): number => {
  const creeps = _.filter(Game.creeps, {
    filter: (creep: Creep) => creep.memory.role === role
  });
  return creeps.length;
};

const allRoles = (): number[] => {
  let output: number[] = [];
  for (const v in Role) {
    if (typeof Role[v] === "number") {
      output.push(Number(v));
    }
  }
  return output;
};

export const run = (): void => {
  // Automatically delete memory of missing creeps
  if (Game.time % 100 === 0) {
    clean();
  }
  const spawn = Game.spawns["Spawn1"];
  const roomName = Object.keys(Game.rooms)[0];
  const room = Game.rooms[roomName];

  for (const r in allRoles()) {
    const role = (r as any) as Role;
    const roleName = Role[role];
    const creeps = _.filter(Game.creeps, (creep: Creep) => creep.memory.role === role);
    const roleConfig = RoleMap[role];
    if (creeps.length < roleConfig.minNumber) {
      spawnCreep(spawn, role, roleName, roleConfig.body);
    }
    const classObj = roleConfig.cls;
    creeps.forEach((creep: Creep) => {
      const c = new classObj(creep);
      c.run();
    });
  }
};
