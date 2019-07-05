import Harvest from "./harvest";
import Move from "./move";

class ActionManager {
  map = {
    'harvest': Harvest,
    'move': Move
  }
  load(type, data) {

  }
}
