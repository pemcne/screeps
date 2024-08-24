declare interface Request {
  target: any;
  priority: number;
  total: number;
  progress: number;
  fulfiller?: Creep[];
  isComplete(): boolean;
  export(): {[key: string]: any};
}
