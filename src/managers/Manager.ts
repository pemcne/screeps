abstract class Manager {
  abstract memoryKey: string;
  constructor(public name: string, private base: Manager | null) { }
  init() {
    if (!Memory[this.memoryKey]) {
      Memory[this.memoryKey][this.name] = {};
    }
  }
  abstract run(): void;
}

export default Manager;
