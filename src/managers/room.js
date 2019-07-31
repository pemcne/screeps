class RoomManager {
  constructor(base, room) {
    this.base = base;
  }


  findAt(room, pos, type) {
    const sites = room.lookForAt(LOOK_STRUCTURES, pos);
    sites.forEach((i) => {
      console.log(i.type, i.id);
      if (i.type ===  type) {
        return i.id;
      }
    });
  }
  buildComplete(siteId) {
    _.remove(Memory.constructionSites, (s) => s.id === siteId);
  }





  scan(roomMemory, room) {


    return roomMemory;
  }
  run() {
    this.base.rooms.forEach((r) => {
      const room = new Room(r);
      room.scan();
    });
  }
}

export default RoomManager;
