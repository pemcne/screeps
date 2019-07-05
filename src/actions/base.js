export default class Action {
  constructor(creep, type, data) {
    this.creep = creep;
    this.type = type;
    this.data = data;
  }
  run() {
    throw new Error('Run has not been implemented');
  }
}
