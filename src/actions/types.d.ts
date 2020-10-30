declare interface ActionItem {
  type: string;
  data: { [key: string]: any };
  repeat?: boolean;
}

declare interface Action {
  type: string;
  data: { [key: string]: any };
  id: string;
  repeat?: boolean;
  isComplete(): boolean;
  run(): ActionItem | null;
}
