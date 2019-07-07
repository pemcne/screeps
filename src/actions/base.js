export default class Action {
  constructor(creep, type, data, repeat = false) {
    this.creep = creep;
    this.type = type;
    this.data = data;
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
