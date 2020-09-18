export default class ConstructionRequest implements Request {
  public requester!: string;
  public fulfiller!: Creep[];
  public target!: ConstructionSite | null;
  public type!: StructureConstant;
  public data!: {};
  constructor(requester: string, type: StructureConstant) {
    this.requester = requester;
    this.type = type;
  }
  isComplete() {
    return this.target === null;
  }
  export() {
    return {
      requester: this.requester,
      fulfiller: this.fulfiller?.map((creep: Creep) => creep.id),
      target: this.target?.id,
      type: this.type,
      data: this.data
    };
  }
  static load(importData: any) {
    const c = new ConstructionRequest(importData.requester, importData.type);
    c.fulfiller = importData.fulfiller?.map((creep: Id<Creep>) => Game.getObjectById(creep));
    c.target = importData.target;
    c.data = importData.data;
    return c;
  }
}
