RoomPosition.prototype.findClosestNByPath = function(objects, n, opts) {
  let paths = [];
  const searchOpts = Object.assign({ignoreCreeps: true}, opts)
  objects.forEach((o) => {
    const path = this.findPathTo(o, searchOpts);
    paths.push({
      object: o,
      path: path
    });
  });
  paths.sort((a, b) => a.path.length - b.path.length);
  const final = paths.slice(0, n);
  return final.map((p) => p.object);
}
