import { Harvester } from './roles/harvester';
import { Worker } from './roles/worker';

const RolePriority = ['worker', 'harvester'];
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
    minNumber: 4
  }
};

export { RolePriority, RoleMap };
