const initMemory = () => {
  if (Memory.sources === undefined) {
    Memory.sources = {};
  }
  if (Memory.bases === undefined) {
    Memory.bases = {};
  }
};

export { initMemory };
