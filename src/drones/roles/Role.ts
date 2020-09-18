interface Role {
  name: string,
  cls: Drone,
  baseBody: BodyPartConstant[],
  repeatBody: BodyPartConstant[],
  minNumber: number
}

enum RoleType {
  harvester = "harvester",
  worker = "worker",
  hauler = "hauler"
}

const RoleMap: { [key: RoleType]: Role } = {
  "harvester": {
    name: RoleType.harvester,
    
  }
}

export { Role };
