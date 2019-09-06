export default class BaseOrder {
  constructor(requester, target) {
    this.requester = requester;
    this.target = target;
    this.id = this.generateId();
  }
  generateId() {
    return _.uniqueId(`order-${this.requester.id}`);
  }
  assign(assignee) {
    this.assignee = assignee;
  }
}
