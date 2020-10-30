declare interface Request {
  requester: any;
  target: any;
  fulfiller: any;
  data?: any;
  isComplete(): boolean;
}

declare interface EnergyRequestData {
  progress: number;
  committed: number;
  total: number;
}
