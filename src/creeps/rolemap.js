import { Harvester } from './roles/harvester';
import { Worker } from './roles/worker';

const RolePriority = ['harvester', 'builder', 'upgrader'];
const RoleMap = {
  'harvester': {
    name: 'harvester',
    cls: Harvester,
    baseBody: [WORK, CARRY, MOVE, MOVE],
    repeatBody: [WORK, WORK, CARRY, MOVE],
    minNumber: 3
  },
  'worker': {
    name: 'worker',
    cls: Worker,
    baseBody: [WORK, WORK, CARRY, MOVE],
    repeatBody: [WORK, WORK, CARRY, MOVE],
    minNumber: 2
  }
};

export { RolePriority, RoleMap };
