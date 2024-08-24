export default class EnergyRequest implements Request {
  public target: AnyStoreStructure;
  public priority: number;
  public total: number;
  public progress!: number;
  public fulfiller!: Creep[];

  constructor(target: AnyStoreStructure, priority: number, total: number) {
    this.target = target;
    this.priority = priority;
    this.total = total;
    this.progress = 0;
    this.fulfiller = [];
  }

  public isComplete() {
    return this.progress >= this.total;
  }

  public export() {
    return {
      target: this.target.id,
      priority: this.priority,
      total: this.total,
      progress: this.progress,
      fulfiller: _.map(this.fulfiller, 'id')
    };
  }
  public static load(data: any) {
    const target = Game.getObjectById(data.target as Id<AnyStoreStructure>);
    if (target === null) {
      console.log('ERR: Unable to load energy request target: %s', data.target);
      return undefined;
    }
    const r = new EnergyRequest(target, data.priority, data.total);
    r.progress = data.progress;
    const 
    r.fulfiller = data.fulfiller;
    return r;
  }
}
