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
  counter() {
    if (this.data.count) {
      if (!this.data.iteration) {
        this.data.iteration = 1;
      } else {
        this.data.iteration++;
      }
    }
  }
  countComplete() {
    if (this.data.count && this.data.iteration) {
      return this.data.iteration > this.data.count;
    }
    return false;
  }
  isComplete() {
    throw new Error('isComplete has not been implemented');
  }
  run() {
    throw new Error('Run has not been implemented');
  }
}
