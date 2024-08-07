declare interface ActionItem {
  type: string;
  data: ActionData;
  repeat?: boolean;
  id?: string;
}

declare interface Action {
  type: string;
  data: ActionData;
  id: string;
  repeat?: boolean;
  isComplete(): boolean;
  run(): ActionItem | null;
}

declare interface ActionData {
  target: any
  count?: number;
  iteraction?: number;
  iteration?: number;
}

declare interface MoveActionData extends ActionData {
  target: RoomPosition;
  range?: number;
}

declare interface HarvestActionData extends ActionData {
  target: Id<Source>;
}

declare interface TransferActionData extends ActionData {
  type: ResourceConstant;
  direction: number;
}
