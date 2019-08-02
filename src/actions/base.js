export default class Action {
  constructor(creep, data, repeat = false) {
    this.creep = creep;
    this.rawData = data;
    this.type = data.type;
    this.data = data.data;
    this.repeat = repeat;
    this.init();
  }
  init() {}
  isComplete() {
    throw new Error('isComplete has not been implemented');
  }
  run() {
    throw new Error('Run has not been implemented');
  }
}
