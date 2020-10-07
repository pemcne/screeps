declare enum ActionType {
  Harvest = "HARVEST",
  Move = "MOVE",
  Transfer = "TRANSFER",
  Upgrade = "UPGRADE"
}

declare interface ActionItem {
  type: ActionType;
  data: { [key: string]: any };
  repeat?: boolean;
}

declare interface Action {
  type: ActionType;
  data: { [key: string]: any };
  id: string;
  repeat?: boolean;
  isComplete(): boolean;
  run(): ActionItem | null;
}

declare enum TransferDirection {
  Withdraw,
  Deposit
}
