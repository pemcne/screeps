import { Harvester } from './roles/harvester';
import { Worker } from './roles/worker';
import { Hauler } from './roles/hauler';

const RolePriority = ['harvester', 'worker'];
const RoleMap = {
  'harvester': {
    name: 'harvester',
    cls: Harvester,
    baseBody: [WORK, WORK, CARRY, MOVE],
    repeatBody: [WORK, WORK, CARRY, MOVE],
    minNumber: 2
  },
  'worker': {
    name: 'worker',
    cls: Worker,
    baseBody: [WORK, WORK, CARRY, MOVE],
    repeatBody: [WORK, WORK, CARRY, MOVE],
    minNumber: 4
  },
  'hauler': {
    name: 'hauler',
    cls: Hauler,
    baseBody: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    repeatBody: [CARRY, MOVE],
    minNumber: 1
  }
};

export { RolePriority, RoleMap };
