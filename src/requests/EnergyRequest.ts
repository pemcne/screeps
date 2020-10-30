export default class EnergyRequest implements Request {
  public requester!: string;
  public fulfiller!: (Creep | AnyStoreStructure)[];
  public target!: Creep | AnyStoreStructure;
  public data!: EnergyRequestData;
  constructor(requester: string) {
    this.requester = requester;
  }
  isComplete() {
    return this.data.progress >= this.data.total;
  }
  export() {
    return {
      requester: this.requester,
      fulfiller: this.fulfiller?.map((t: Creep | AnyStoreStructure) => t.id),
      target: this.target?.id,
      data: this.data
    };
  }
  static load(importData: any) {
    const c = new EnergyRequest(importData.requester);
    c.fulfiller = importData.fulfiller;
    c.target = importData.target;
    c.data = importData.data;
    return c;
  }
}
