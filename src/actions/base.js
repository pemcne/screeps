export default class Action {
  constructor(creep, data, repeat = false) {
    this.creep = creep;
    this.rawData = data;
    this.type = data.type;
    this.data = data.data;
    this.repeat = repeat;
    this.init();
    if (!this.rawData.id) {
      this.rawData.id = _.uniqueId(`${this.creep.name}-${this.type}`);
    }
    this.id = this.rawData.id;
    if (this.rawData.dependsOn) {
      this.dependsOn = this.rawData.dependsOn;
    } else {
      this.dependsOn = null;
    }
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
